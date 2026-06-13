import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

// Validation helper
function validateAgreementData(data: any): { valid: boolean; error?: string } {
  if (!data.deal_id || typeof data.deal_id !== 'string') {
    return { valid: false, error: 'Deal ID is required' };
  }
  if (!data.lead_id || typeof data.lead_id !== 'string') {
    return { valid: false, error: 'Lead ID is required' };
  }
  if (typeof data.deposit_amount !== 'number' || data.deposit_amount < 0) {
    return { valid: false, error: 'Valid deposit amount is required' };
  }
  return { valid: true };
}

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get user's org_id from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.org_id) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 403 });
  }
  
  const { searchParams } = new URL(request.url);
  
  const dealId = searchParams.get("deal_id");
  const leadId = searchParams.get("lead_id");
  const status = searchParams.get("status");
  
  let query = supabase
    .from("purchase_agreements")
    .select(`
      *,
      deal:deals!inner(*),
      lead:leads!inner(*),
      home:home_inventory(*),
      created_by_profile:profiles(full_name)
    `)
    .eq("org_id", profile.org_id)  // Enforce org isolation
    .order("created_at", { ascending: false });
  
  if (dealId) {
    query = query.eq("deal_id", dealId);
  }
  
  if (leadId) {
    query = query.eq("lead_id", leadId);
  }
  
  if (status) {
    query = query.eq("status", status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Agreements GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch agreements' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get user's org_id from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.org_id) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 403 });
  }
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  
  // Validate input
  const validation = validateAgreementData(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  
  // Enforce org_id and created_by from authenticated user
  const agreementData = {
    ...body,
    org_id: profile.org_id,
    created_by: user.id,
  };
  
  const { data, error } = await supabase
    .from("purchase_agreements")
    .insert(agreementData)
    .select()
    .single();
  
  if (error) {
    console.error('Agreements POST error:', error);
    return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get user's org_id from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.org_id) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 403 });
  }
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  
  const { id, ...updates } = body;
  
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });
  }
  
  // Verify the agreement belongs to the user's org before updating
  const { data: existing } = await supabase
    .from("purchase_agreements")
    .select("id")
    .eq("id", id)
    .eq("org_id", profile.org_id)
    .single();
  
  if (!existing) {
    return NextResponse.json({ error: 'Agreement not found or access denied' }, { status: 404 });
  }
  
  const { data, error } = await supabase
    .from("purchase_agreements")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("org_id", profile.org_id)  // Extra safety: ensure org match
    .select()
    .single();
  
  if (error) {
    console.error('Agreements PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
