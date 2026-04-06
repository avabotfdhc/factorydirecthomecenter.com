'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { PurchaseAgreementFormData } from '@/app/types'

const supabase = createAdminClient()

export async function getStateComplianceRequirements(stateCode: string) {
  const { data, error } = await supabase
    .from('state_compliance_requirements')
    .select('*')
    .eq('state_code', stateCode)
    .single()

  if (error) {
    console.error('Error fetching state compliance:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getLegalTemplates(stateCode?: string) {
  let query = supabase
    .from('purchase_agreement_templates')
    .select('*')
    .eq('is_default', true)
  
  if (stateCode) {
    query = query.or(`state_code.eq.${stateCode},state_code.is.null`)
  }
  
  const { data, error } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createPurchaseAgreementWithCompliance(formData: {
  deal_id: string
  lead_id: string
  org_id: string
  created_by: string
  deposit_amount: number
  deposit_payment_method: string
  delivery_state: string
  site_address?: string
  site_city?: string
  site_state?: string
  site_zip?: string
  expected_delivery_date?: string
  special_terms?: string
  included_options?: string[]
  upgrades?: Array<{
    category: string
    description: string
    manufacturer?: string
    model_number?: string
    retail_price: number
    installation_cost?: number
    warranty_period_months?: number
  }>
  disclosures: {
    asbestos_acknowledged: boolean
    lead_paint_acknowledged: boolean
    formaldehyde_acknowledged: boolean
    mold_acknowledged: boolean
    cooling_off_waived: boolean
  }
}) {
  try {
    // Get state compliance requirements
    const { data: stateCompliance } = await supabase
      .from('state_compliance_requirements')
      .select('*')
      .eq('state_code', formData.delivery_state)
      .single()

    if (!stateCompliance) {
      return { success: false, error: 'Invalid delivery state' }
    }

    // Get deal and lead info
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, lead:leads(*), home:home_inventory(*)')
      .eq('id', formData.deal_id)
      .single()

    if (dealError || !deal) {
      return { success: false, error: 'Deal not found' }
    }

    // Validate deposit doesn't exceed max allowed
    const totalPrice = (deal.base_home_price || 0) + 
                      (deal.factory_options_price || 0) + 
                      (deal.freight_cost || 0) + 
                      (deal.setup_cost || 0)
    
    const maxDeposit = totalPrice * (stateCompliance.max_deposit_percent / 100)
    if (formData.deposit_amount > maxDeposit) {
      return { 
        success: false, 
        error: `Deposit cannot exceed ${stateCompliance.max_deposit_percent}% of purchase price (${maxDeposit})` 
      }
    }

    // Create purchase agreement
    const { data: agreement, error } = await supabase
      .from('purchase_agreements')
      .insert({
        org_id: formData.org_id,
        deal_id: formData.deal_id,
        lead_id: formData.lead_id,
        delivery_state: formData.delivery_state,
        delivery_state_tax_rate: stateCompliance.sales_tax_rate,
        deposit_amount: formData.deposit_amount,
        deposit_payment_method: formData.deposit_payment_method,
        site_address: formData.site_address,
        site_city: formData.site_city,
        site_state: formData.site_state,
        site_zip: formData.site_zip,
        expected_delivery_date: formData.expected_delivery_date,
        special_terms: formData.special_terms,
        included_options: formData.included_options || [],
        hud_installation_standards: stateCompliance.hud_installation_code,
        cooling_off_period_waived: formData.disclosures.cooling_off_waived,
        asbestos_disclosure_acknowledged: formData.disclosures.asbestos_acknowledged,
        lead_paint_disclosure_acknowledged: formData.disclosures.lead_paint_acknowledged,
        formaldehyde_disclosure_acknowledged: formData.disclosures.formaldehyde_acknowledged,
        mold_disclosure_acknowledged: formData.disclosures.mold_acknowledged,
        addendum_a_included: formData.upgrades && formData.upgrades.length > 0,
        created_by: formData.created_by
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating agreement:', error)
      return { success: false, error: error.message }
    }

    // Add upgrades to Addendum A if provided
    if (formData.upgrades && formData.upgrades.length > 0) {
      const upgradesWithAgreementId = formData.upgrades.map((upgrade, index) => ({
        agreement_id: agreement.id,
        item_number: `A-${String(index + 1).padStart(3, '0')}`,
        ...upgrade
      }))

      const { error: upgradesError } = await supabase
        .from('addendum_a_upgrades')
        .insert(upgradesWithAgreementId)

      if (upgradesError) {
        console.error('Error adding upgrades:', upgradesError)
      }

      // Calculate Addendum A total
      const addendumTotal = formData.upgrades.reduce((sum, u) => sum + u.retail_price + (u.installation_cost || 0), 0)
      
      await supabase
        .from('purchase_agreements')
        .update({ addendum_a_total: addendumTotal })
        .eq('id', agreement.id)
    }

    // Log activity
    await supabase.from('activities').insert({
      org_id: formData.org_id,
      lead_id: formData.lead_id,
      deal_id: formData.deal_id,
      user_id: formData.created_by,
      type: 'NOTE',
      notes: `Purchase agreement ${agreement.agreement_number} created for ${formData.delivery_state}`,
      completed_at: new Date().toISOString()
    })

    return { success: true, data: agreement }
  } catch (error) {
    console.error('Error creating purchase agreement:', error)
    return { success: false, error: 'Failed to create purchase agreement' }
  }
}

export async function generateLegalDocument(agreementId: string, documentType: 'MASTER' | 'ADDENDUM_A' | 'HUD' | 'STATE') {
  // Get agreement with all related data
  const { data: agreement, error } = await supabase
    .from('purchase_agreements')
    .select(`
      *,
      deal:deals(*),
      lead:leads(*),
      home:home_inventory(*),
      upgrades:addendum_a_upgrades(*)
    `)
    .eq('id', agreementId)
    .single()

  if (error || !agreement) {
    return { success: false, error: 'Agreement not found' }
  }

  // Get appropriate template
  const { data: template } = await supabase
    .from('purchase_agreement_templates')
    .select('*')
    .eq('template_type', documentType === 'MASTER' ? 'MASTER_AGREEMENT' : 
                         documentType === 'ADDENDUM_A' ? 'ADDENDUM_A' :
                         documentType === 'HUD' ? 'HUD_DISCLOSURE' : 'STATE_DISCLOSURE')
    .eq('state_code', agreement.delivery_state)
    .eq('is_default', true)
    .single()

  if (!template) {
    return { success: false, error: 'Template not found' }
  }

  // Calculate totals
  const baseTotal = agreement.base_home_price + 
                   agreement.factory_options_price + 
                   agreement.freight_cost + 
                   agreement.setup_cost +
                   agreement.site_prep_price -
                   agreement.trade_in_value

  // Populate template
  let content = template.body_content
    .replace(/{agreement_number}/g, agreement.agreement_number)
    .replace(/{agreement_date}/g, agreement.agreement_date)
    .replace(/{client_first_name}/g, agreement.client_first_name)
    .replace(/{client_last_name}/g, agreement.client_last_name)
    .replace(/{client_phone}/g, agreement.client_phone)
    .replace(/{client_email}/g, agreement.client_email || '')
    .replace(/{client_address}/g, agreement.client_address || '')
    .replace(/{city}/g, agreement.client_city || '')
    .replace(/{state}/g, agreement.client_state || '')
    .replace(/{zip}/g, agreement.client_zip || '')
    .replace(/{manufacturer}/g, agreement.manufacturer || '')
    .replace(/{model_name}/g, agreement.model_name || '')
    .replace(/{year}/g, agreement.year?.toString() || '')
    .replace(/{serial_number}/g, agreement.serial_number || '')
    .replace(/{hud_label_number}/g, agreement.hud_label_number || '')
    .replace(/{base_home_price}/g, agreement.base_home_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{factory_options_price}/g, agreement.factory_options_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{freight_setup}/g, (agreement.freight_cost + agreement.setup_cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{site_prep_price}/g, agreement.site_prep_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{trade_in_value}/g, agreement.trade_in_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{sales_tax}/g, agreement.sales_tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{tax_rate}/g, (agreement.delivery_state_tax_rate * 100).toFixed(2))
    .replace(/{total_price}/g, agreement.total_with_tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{deposit_amount}/g, agreement.deposit_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{deposit_status}/g, agreement.deposit_paid ? 'PAID' : 'PENDING')
    .replace(/{down_payment}/g, agreement.down_payment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{loan_amount}/g, agreement.loan_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{monthly_payment}/g, agreement.monthly_payment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{site_address}/g, agreement.site_address || '')
    .replace(/{expected_delivery_date}/g, agreement.expected_delivery_date || 'TBD')
    .replace(/{cooling_off_date}/g, agreement.cooling_off_period_end || '')
    .replace(/{hud_standards}/g, agreement.hud_installation_standards || '')

  // Handle Addendum A upgrades table
  if (documentType === 'ADDENDUM_A' && agreement.upgrades) {
    const upgradeTable = agreement.upgrades.map((u: any) => 
      `${u.item_number} | ${u.category} | ${u.description} | ${u.retail_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
    ).join('\n')
    
    content = content
      .replace(/{upgrade_table}/g, upgradeTable)
      .replace(/{addendum_a_total}/g, agreement.addendum_a_total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
  }

  return { 
    success: true, 
    content,
    template: template
  }
}

export async function getAddendumAUpgrades(agreementId: string) {
  const { data, error } = await supabase
    .from('addendum_a_upgrades')
    .select('*')
    .eq('agreement_id', agreementId)
    .order('item_number')

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function addUpgradeToAddendumA(agreementId: string, upgrade: {
  category: string
  description: string
  manufacturer?: string
  model_number?: string
  retail_price: number
  dealer_cost?: number
  installation_cost?: number
  warranty_period_months?: number
  installed_by?: string
}) {
  // Get current count for item number
  const { count } = await supabase
    .from('addendum_a_upgrades')
    .select('*', { count: 'exact' })
    .eq('agreement_id', agreementId)

  const itemNumber = `A-${String((count || 0) + 1).padStart(3, '0')}`

  const { data, error } = await supabase
    .from('addendum_a_upgrades')
    .insert({
      agreement_id: agreementId,
      item_number: itemNumber,
      ...upgrade
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Update agreement addendum_a_total
  const { data: upgrades } = await supabase
    .from('addendum_a_upgrades')
    .select('retail_price, installation_cost')
    .eq('agreement_id', agreementId)

  const total = upgrades?.reduce((sum, u) => sum + u.retail_price + (u.installation_cost || 0), 0) || 0

  await supabase
    .from('purchase_agreements')
    .update({ 
      addendum_a_total: total,
      addendum_a_included: true 
    })
    .eq('id', agreementId)

  return { success: true, data }
}

export async function removeUpgradeFromAddendumA(upgradeId: string, agreementId: string) {
  const { error } = await supabase
    .from('addendum_a_upgrades')
    .delete()
    .eq('id', upgradeId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Recalculate total
  const { data: upgrades } = await supabase
    .from('addendum_a_upgrades')
    .select('retail_price, installation_cost')
    .eq('agreement_id', agreementId)

  const total = upgrades?.reduce((sum, u) => sum + u.retail_price + (u.installation_cost || 0), 0) || 0

  await supabase
    .from('purchase_agreements')
    .update({ 
      addendum_a_total: total,
      addendum_a_included: total > 0
    })
    .eq('id', agreementId)

  return { success: true }
}
