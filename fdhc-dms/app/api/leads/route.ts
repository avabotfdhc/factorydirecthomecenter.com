import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

// Simple validation helper
function validateLeadData(data: any): { valid: boolean; error?: string } {
  if (!data.first_name || typeof data.first_name !== 'string' || data.first_name.length < 1) {
    return { valid: false, error: 'First name is required' };
  }
  if (!data.last_name || typeof data.last_name !== 'string' || data.last_name.length < 1) {
    return { valid: false, error: 'Last name is required' };
  }
  if (!data.phone || typeof data.phone !== 'string' || !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) {
    return { valid: false, error: 'Valid phone number is required' };
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, error: 'Invalid email format' };
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
  
  const status = searchParams.get("status");
  const assigned = searchParams.get("assigned");
  
  let query = supabase
    .from("leads")
    .select("*, assigned_profile:profiles(full_name)")
    .eq("org_id", profile.org_id)  // Enforce org isolation
    .order("created_at", { ascending: false });
  
  if (status) {
    query = query.eq("status", status);
  }
  
  if (assigned) {
    query = query.eq("assigned_to", assigned);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
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
  const validation = validateLeadData(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  
  // Enforce org_id from authenticated user's profile
  const leadData = {
    ...body,
    org_id: profile.org_id,
  };
  
  const { data, error } = await supabase
    .from("leads")
    .insert(leadData)
    .select()
    .single();
  
  if (error) {
    console.error('Leads POST error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
