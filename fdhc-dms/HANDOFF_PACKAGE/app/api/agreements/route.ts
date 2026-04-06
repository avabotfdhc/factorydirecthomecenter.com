import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const dealId = searchParams.get("deal_id");
  const leadId = searchParams.get("lead_id");
  const status = searchParams.get("status");
  
  let query = supabase
    .from("purchase_agreements")
    .select(`
      *,
      deal:deals(*),
      lead:leads(*),
      home:home_inventory(*),
      created_by_profile:profiles(full_name)
    `)
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  
  const { data, error } = await supabase
    .from("purchase_agreements")
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { id, ...updates } = await request.json();
  
  const { data, error } = await supabase
    .from("purchase_agreements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
