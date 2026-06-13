'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { LeadFormData, LandStatus } from '@/app/types'

// Validate required environment variables
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID;
if (!DEFAULT_ORG_ID) {
  throw new Error('Missing required environment variable: DEFAULT_ORG_ID');
}

const supabase = createAdminClient()

export async function processIncomingLead(leadData: LeadFormData) {
  try {
    // 1. Determine Lead Complexity
    const isLandHome = leadData.land_status === 'OWNS_LAND' || leadData.land_status === 'BUYING_LAND'
    
    // 2. Query Available Reps
    let query = supabase
      .from('profiles')
      .select('id, full_name, last_assignment_at, handles_land_home, is_online')
      .eq('is_active', true)
      .eq('org_id', DEFAULT_ORG_ID)  // Enforce org isolation
      .order('last_assignment_at', { ascending: true })

    if (isLandHome) {
      query = query.eq('handles_land_home', true)
    }

    const { data: availableReps, error: repError } = await query

    if (repError || !availableReps || availableReps.length === 0) {
      return await assignToManagerQueue(leadData)
    }

    // 3. Select the "Hungriest" Rep (least recently assigned)
    const selectedRep = availableReps[0]

    // 4. Insert the Lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        org_id: DEFAULT_ORG_ID,
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        phone: leadData.phone,
        email: leadData.email || null,
        source: leadData.source,
        land_status: leadData.land_status,
        land_location: leadData.land_location || null,
        target_move_in: leadData.target_move_in || null,
        assigned_to: selectedRep.id,
        status: 'NEW'
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 5. Update Rep's Timestamp
    await supabase
      .from('profiles')
      .update({ last_assignment_at: new Date().toISOString() })
      .eq('id', selectedRep.id)

    // 6. Log activity
    await supabase.from('activities').insert({
      org_id: process.env.DEFAULT_ORG_ID!,
      lead_id: newLead.id,
      user_id: selectedRep.id,
      type: 'NOTE',
      notes: `Lead automatically assigned via round-robin routing`,
      completed_at: new Date().toISOString()
    })

    return { 
      success: true, 
      lead_id: newLead.id,
      assigned_to: selectedRep.full_name
    }

  } catch (error) {
    console.error('Lead Routing Failed:', error)
    return { success: false, error: 'Failed to process lead routing' }
  }
}

async function assignToManagerQueue(leadData: LeadFormData) {
  const { data: newLead, error } = await supabase
    .from('leads')
    .insert({
      org_id: DEFAULT_ORG_ID,
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      phone: leadData.phone,
      email: leadData.email || null,
      source: leadData.source,
      land_status: leadData.land_status,
      land_location: leadData.land_location || null,
      target_move_in: leadData.target_move_in || null,
      assigned_to: null,
      status: 'NEW'
    })
    .select()
    .single()

  if (error) throw error

  return { 
    success: true, 
    lead_id: newLead.id, 
    assigned_to: 'Manager Review Queue' 
  }
}

export async function getLeads(filters?: { status?: string; assigned_to?: string; org_id?: string }) {
  const orgId = filters?.org_id || DEFAULT_ORG_ID;
  
  let query = supabase
    .from('leads')
    .select(`
      *,
      assigned_profile:profiles(full_name, email)
    `)
    .eq('org_id', orgId)  // Enforce org isolation
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      assigned_profile:profiles(full_name, email, phone),
      activities(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching lead:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateLead(id: string, updates: Partial<LeadFormData>) {
  const { data, error } = await supabase
    .from('leads')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function logActivity({
  lead_id,
  deal_id,
  user_id,
  type,
  direction,
  outcome,
  notes,
  duration_seconds,
  scheduled_at,
  org_id
}: {
  lead_id?: string
  deal_id?: string
  user_id: string
  type: string
  direction?: string
  outcome?: string
  notes?: string
  duration_seconds?: number
  scheduled_at?: string
  org_id?: string
}) {
  const activityOrgId = org_id || DEFAULT_ORG_ID;
  
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        org_id: activityOrgId,
        lead_id,
        deal_id,
        user_id,
        type,
        direction,
        outcome,
        notes,
        duration_seconds,
        scheduled_at,
        completed_at: outcome ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      console.error('Error logging activity:', error)
      return { success: false, error: error.message }
    }

    // Update lead's last contact info
    if (lead_id && outcome) {
      try {
        await supabase
          .from('leads')
          .update({
            last_contact_at: new Date().toISOString(),
          })
          .eq('id', lead_id)
          .eq('org_id', activityOrgId)
      } catch (updateError) {
        console.error('Error updating lead contact info:', updateError)
        // Don't fail the activity log if lead update fails
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in logActivity:', error)
    return { success: false, error: 'Failed to log activity' }
  }
}
