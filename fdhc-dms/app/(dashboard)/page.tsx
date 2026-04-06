import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCard } from "@/app/components/StatsCard";
import { QuickActions } from "@/app/components/QuickActions";
import { LeadsTable } from "@/app/components/LeadsTable";
import {
  Users,
  DollarSign,
  Home,
  Phone,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get stats
  const { data: leadsToday } = await supabase
    .from("leads")
    .select("id", { count: "exact" })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  const { data: dealsThisMonth } = await supabase
    .from("deals")
    .select("id", { count: "exact" })
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  const { data: recentLeads } = await supabase
    .from("leads")
    .select(`
      *,
      assigned_profile:profiles(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="New Leads Today"
          value={leadsToday?.length || 0}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Active Deals"
          value={dealsThisMonth?.length || 0}
          icon={DollarSign}
          trend="+5%"
          trendUp={true}
        />
        <StatsCard
          title="Homes on Lot"
          value={12}
          icon={Home}
          trend="-2"
          trendUp={false}
        />
        <StatsCard
          title="Calls Today"
          value={8}
          icon={Phone}
          trend="+3"
          trendUp={true}
        />
      </div>

      <QuickActions />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Leads</h3>
        </div>
        <LeadsTable leads={recentLeads || []} compact />
      </div>
    </div>
  );
}
