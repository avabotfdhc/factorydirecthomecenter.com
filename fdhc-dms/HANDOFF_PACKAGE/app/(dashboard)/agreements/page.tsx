import { getPurchaseAgreements } from "@/app/actions/purchase-agreements";
import Link from "next/link";
import { Plus, FileText, Search } from "lucide-react";
import { formatDate, formatCurrency } from "@/app/lib/utils";
import { Badge } from "@/app/components/ui/Badge";

export default async function PurchaseAgreementsPage({
  searchParams,
}: {
  searchParams: { deal_id?: string; lead_id?: string; status?: string };
}) {
  const result = await getPurchaseAgreements({
    deal_id: searchParams.deal_id,
    lead_id: searchParams.lead_id,
    status: searchParams.status,
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING_SIGNATURE: "bg-yellow-100 text-yellow-800",
    SIGNED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    EXPIRED: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Agreements</h1>
          <p className="text-slate-500">Manage and track purchase agreements</p>
        </div>
        <Link
          href="/dashboard/agreements/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          New Agreement
        </Link>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by agreement number or client name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_SIGNATURE">Pending Signature</option>
            <option value="SIGNED">Signed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Agreements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {result.success && result.data && result.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Agreement #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Home
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.data.map((agreement: any) => (
                  <tr key={agreement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        <span className="font-medium text-slate-900">
                          {agreement.agreement_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {agreement.client_first_name} {agreement.client_last_name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {agreement.client_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {agreement.manufacturer}
                      </div>
                      <div className="text-sm text-slate-500">
                        {agreement.model_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(
                          agreement.base_home_price +
                          agreement.factory_options_price +
                          agreement.freight_cost +
                          agreement.setup_cost
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        Deposit: {formatCurrency(agreement.deposit_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[agreement.status] || "bg-gray-100"}>
                        {agreement.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(agreement.agreement_date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/agreements/${agreement.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No purchase agreements yet
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first purchase agreement to get started
            </p>
            <Link
              href="/dashboard/agreements/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create Agreement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
