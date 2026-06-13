import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

// Validation helper
function validateActivityData(data: any): { valid: boolean; error?: string } {
  if (!data.type || typeof data.type !== 'string') {
    return { valid: false, error: 'Activity type is required' };
  }
  const validTypes = ['PHONE_CALL', 'EMAIL', 'SMS', 'APPOINTMENT', 'SITE_VISIT', 'DESKING', 'NOTE', 'STATUS_CHANGE'];
  if (!validTypes.includes(data.type)) {
    return { valid: false, error: 'Invalid activity type' };
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
  
  const leadId = searchParams.get("lead_id");
  
  let query = supabase
    .from("activities")
    .select("*, user:profiles(full_name)")
    .eq("org_id", profile.org_id)  // Enforce org isolation
    .order("created_at", { ascending: false });
  
  if (leadId) {
    query = query.eq("lead_id", leadId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Activities GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
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
  const validation = validateActivityData(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  
  // Enforce org_id and user_id from authenticated user
  const activityData = {
    ...body,
    org_id: profile.org_id,
    user_id: user.id,
  };
  
  const { data, error } = await supabase
    .from("activities")
    .insert(activityData)
    .select()
    .single();
  
  if (error) {
    console.error('Activities POST error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
