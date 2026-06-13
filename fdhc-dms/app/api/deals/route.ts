import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

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
  
  const { data, error } = await supabase
    .from("deals")
    .select("*, lead:leads!inner(*), home:home_inventory(*)")
    .eq("leads.org_id", profile.org_id)  // Enforce org isolation via lead relationship
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error('Deals GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
