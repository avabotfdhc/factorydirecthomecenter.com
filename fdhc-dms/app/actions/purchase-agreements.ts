'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { PurchaseAgreementFormData } from '@/app/types'

const supabase = createAdminClient()

export async function createPurchaseAgreement(formData: PurchaseAgreementFormData & { 
  lead_id: string
  org_id: string 
  created_by: string 
}) {
  try {
    // Get deal info to auto-populate
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, lead:leads(*), home:home_inventory(*)')
      .eq('id', formData.deal_id)
      .single()

    if (dealError || !deal) {
      return { success: false, error: 'Deal not found' }
    }

    // Create purchase agreement
    const { data: agreement, error } = await supabase
      .from('purchase_agreements')
      .insert({
        org_id: formData.org_id,
        deal_id: formData.deal_id,
        lead_id: formData.lead_id,
        deposit_amount: formData.deposit_amount,
        deposit_payment_method: formData.deposit_payment_method,
        site_address: formData.site_address,
        site_city: formData.site_city,
        site_state: formData.site_state,
        site_zip: formData.site_zip,
        expected_delivery_date: formData.expected_delivery_date,
        special_terms: formData.special_terms,
        included_options: formData.included_options || [],
        created_by: formData.created_by
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating purchase agreement:', error)
      return { success: false, error: error.message }
    }

    // Log activity
    await supabase.from('activities').insert({
      org_id: formData.org_id,
      lead_id: formData.lead_id,
      deal_id: formData.deal_id,
      user_id: formData.created_by,
      type: 'NOTE',
      notes: `Purchase agreement ${agreement.agreement_number} created`,
      completed_at: new Date().toISOString()
    })

    return { success: true, data: agreement }
  } catch (error) {
    console.error('Error creating purchase agreement:', error)
    return { success: false, error: 'Failed to create purchase agreement' }
  }
}

export async function getPurchaseAgreements(filters?: { 
  deal_id?: string
  lead_id?: string
  status?: string 
}) {
  let query = supabase
    .from('purchase_agreements')
    .select(`
      *,
      deal:deals(*),
      lead:leads(*),
      home:home_inventory(*),
      created_by_profile:profiles(full_name)
    `)
    .order('created_at', { ascending: false })

  if (filters?.deal_id) {
    query = query.eq('deal_id', filters.deal_id)
  }

  if (filters?.lead_id) {
    query = query.eq('lead_id', filters.lead_id)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching purchase agreements:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getPurchaseAgreementById(id: string) {
  const { data, error } = await supabase
    .from('purchase_agreements')
    .select(`
      *,
      deal:deals(*),
      lead:leads(*),
      home:home_inventory(*),
      created_by_profile:profiles(full_name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching purchase agreement:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updatePurchaseAgreement(
  id: string, 
  updates: Partial<PurchaseAgreementFormData> & { status?: string }
) {
  const { data, error } = await supabase
    .from('purchase_agreements')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating purchase agreement:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function signPurchaseAgreement(
  id: string,
  signatureType: 'client' | 'sales_rep' | 'manager',
  signatureUrl: string
) {
  const updateField = `${signatureType}_signature_url`
  const updateTimeField = `${signatureType}_signed_at`

  const updates: any = {
    [updateField]: signatureUrl,
    [updateTimeField]: new Date().toISOString()
  }

  // If client signed, update status to PENDING_SIGNATURE (waiting for sales rep)
  // If sales rep signed, keep as PENDING_SIGNATURE (waiting for manager)
  // If manager signed, mark as SIGNED
  if (signatureType === 'manager') {
    updates.status = 'SIGNED'
  } else if (signatureType === 'client') {
    updates.status = 'PENDING_SIGNATURE'
  }

  const { data, error } = await supabase
    .from('purchase_agreements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error signing purchase agreement:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function recordDepositPayment(
  id: string,
  amount: number,
  paymentMethod: string
) {
  const { data, error } = await supabase
    .from('purchase_agreements')
    .update({
      deposit_paid: true,
      deposit_paid_date: new Date().toISOString().split('T')[0],
      deposit_payment_method: paymentMethod,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error recording deposit:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function generateAgreementDocument(id: string) {
  // Get agreement with all related data
  const { data: agreement, error } = await supabase
    .from('purchase_agreements')
    .select(`
      *,
      deal:deals(*),
      lead:leads(*),
      home:home_inventory(*)
    `)
    .eq('id', id)
    .single()

  if (error || !agreement) {
    return { success: false, error: 'Agreement not found' }
  }

  // Get default template
  const { data: template } = await supabase
    .from('purchase_agreement_templates')
    .select('*')
    .eq('is_default', true)
    .single()

  // Generate document content
  const content = template?.content || ''
  
  // Replace placeholders with actual data
  const populatedContent = content
    .replace(/{agreement_date}/g, agreement.agreement_date)
    .replace(/{client_first_name}/g, agreement.client_first_name)
    .replace(/{client_last_name}/g, agreement.client_last_name)
    .replace(/{manufacturer}/g, agreement.manufacturer || '')
    .replace(/{model_name}/g, agreement.model_name || '')
    .replace(/{year}/g, agreement.year?.toString() || '')
    .replace(/{serial_number}/g, agreement.serial_number || '')
    .replace(/{total_price}/g, 
      (agreement.base_home_price + 
       agreement.factory_options_price + 
       agreement.freight_cost + 
       agreement.setup_cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    )
    .replace(/{deposit_amount}/g, agreement.deposit_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{down_payment}/g, agreement.down_payment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{loan_amount}/g, agreement.loan_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    .replace(/{monthly_payment}/g, agreement.monthly_payment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))

  // In production, you would:
  // 1. Generate a PDF from this content
  // 2. Upload to storage
  // 3. Save the URL

  // For now, we'll just update the document_generated_at
  const { data: updated, error: updateError } = await supabase
    .from('purchase_agreements')
    .update({
      document_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { 
    success: true, 
    data: updated,
    documentContent: populatedContent
  }
}
