import { getPurchaseAgreementById, generateAgreementDocument, signPurchaseAgreement } from "@/app/actions/purchase-agreements";
import { formatDate, formatCurrency, formatPhoneNumber } from "@/app/lib/utils";
import Link from "next/link";
import { ArrowLeft, Download, Printer, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/app/components/ui/Badge";

export default async function AgreementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getPurchaseAgreementById(params.id);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Agreement Not Found</h1>
        <p className="text-slate-500 mt-2">The purchase agreement you're looking for doesn't exist.</p>
        <Link
          href="/dashboard/agreements"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Agreements
        </Link>
      </div>
    );
  }

  const agreement = result.data;
  const totalPrice = 
    agreement.base_home_price + 
    agreement.factory_options_price + 
    agreement.freight_cost + 
    agreement.setup_cost;

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING_SIGNATURE: "bg-yellow-100 text-yellow-800",
    SIGNED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    EXPIRED: "bg-slate-100 text-slate-800",
  };

  const statusIcons: Record<string, any> = {
    DRAFT: Clock,
    PENDING_SIGNATURE: AlertCircle,
    SIGNED: CheckCircle,
    CANCELLED: AlertCircle,
    EXPIRED: AlertCircle,
  };

  const StatusIcon = statusIcons[agreement.status] || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/agreements"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={18} />
          Back to Agreements
        </Link>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors">
            <Printer size={18} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Download PDF
          </button>
          {agreement.status === 'DRAFT' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send for Signature
            </button>
          )}
        </div>
      </div>

      {/* Agreement Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Agreement #{agreement.agreement_number}
              </h1>
              <Badge className={statusColors[agreement.status]}>
                <StatusIcon size={14} className="mr-1" />
                {agreement.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-slate-500">
              Created {formatDate(agreement.created_at)} by {agreement.created_by_profile?.full_name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Agreement Date</p>
            <p className="font-medium text-slate-900">{formatDate(agreement.agreement_date)}</p>
            <p className="text-sm text-slate-500 mt-2">Expires</p>
            <p className="font-medium text-slate-900">{formatDate(agreement.expiration_date)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium text-slate-900">
                  {agreement.client_first_name} {agreement.client_last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">
                  {formatPhoneNumber(agreement.client_phone)}
                </p>
              </div>
              {agreement.client_email && (
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{agreement.client_email}</p>
                </div>
              )}
              {(agreement.client_address || agreement.client_city) && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium text-slate-900">
                    {agreement.client_address}
                    {agreement.client_city && `, ${agreement.client_city}`}
                    {agreement.client_state && `, ${agreement.client_state}`}
                    {agreement.client_zip && ` ${agreement.client_zip}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Home Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Home Information</h2>
            {agreement.manufacturer ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Manufacturer</p>
                  <p className="font-medium text-slate-900">{agreement.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Model</p>
                  <p className="font-medium text-slate-900">{agreement.model_name}</p>
                </div>
                {agreement.year && (
                  <div>
                    <p className="text-sm text-slate-500">Year</p>
                    <p className="font-medium text-slate-900">{agreement.year}</p>
                  </div>
                )}
                {agreement.serial_number && (
                  <div>
                    <p className="text-sm text-slate-500">Serial Number</p>
                    <p className="font-medium text-slate-900">{agreement.serial_number}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500">No home information available</p>
            )}
          </div>

          {/* Financial Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Financial Terms</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-slate-600">Base Home Price</span>
                <span className="font-medium">{formatCurrency(agreement.base_home_price)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-slate-600">Factory Options</span>
                <span className="font-medium">{formatCurrency(agreement.factory_options_price)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-slate-600">Freight & Setup</span>
                <span className="font-medium">{formatCurrency(agreement.freight_cost + agreement.setup_cost)}</span>
              </div>
              {agreement.site_prep_price > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-slate-600">Site Prep</span>
                  <span className="font-medium">{formatCurrency(agreement.site_prep_price)}</span>
                </div>
              )}
              {agreement.trade_in_value > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-slate-600">Trade-In Value</span>
                  <span className="font-medium text-green-600">-{formatCurrency(agreement.trade_in_value)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg font-bold">
                <span className="text-slate-900">Total Purchase Price</span>
                <span className="text-slate-900">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Terms</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Deposit Amount</p>
                <p className="font-medium text-slate-900">{formatCurrency(agreement.deposit_amount)}</p>
                {agreement.deposit_paid && (
                  <Badge className="mt-1 bg-green-100 text-green-800">Paid</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Down Payment</p>
                <p className="font-medium text-slate-900">{formatCurrency(agreement.down_payment)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Loan Amount</p>
                <p className="font-medium text-slate-900">{formatCurrency(agreement.loan_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Monthly Payment</p>
                <p className="font-medium text-slate-900">{formatCurrency(agreement.monthly_payment)}</p>
              </div>
            </div>
          </div>

          {/* Site Information */}
          {agreement.site_address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Information</h2>
              <p className="font-medium text-slate-900">{agreement.site_address}</p>
              <p className="text-slate-600">
                {agreement.site_city}, {agreement.site_state} {agreement.site_zip}
              </p>
              {agreement.expected_delivery_date && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Expected Delivery</p>
                  <p className="font-medium text-slate-900">{formatDate(agreement.expected_delivery_date)}</p>
                </div>
              )}
            </div>
          )}

          {/* Special Terms */}
          {agreement.special_terms && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Special Terms</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{agreement.special_terms}</p>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Signature Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Signature Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Client</span>
                {agreement.client_signed_at ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Signed
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Sales Rep</span>
                {agreement.sales_rep_signed_at ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Signed
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Manager</span>
                {agreement.manager_signed_at ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Signed
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                )}
              </div>
            </div>

            {agreement.status !== 'SIGNED' && (
              <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Request Signatures
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/dashboard/deals/${agreement.deal_id}`}
                className="block w-full py-2 text-center border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors"
              >
                View Deal
              </Link>
              <Link
                href={`/dashboard/leads/${agreement.lead_id}`}
                className="block w-full py-2 text-center border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors"
              >
                View Client Profile
              </Link>
              {agreement.home_id && (
                <Link
                  href={`/dashboard/inventory/${agreement.home_id}`}
                  className="block w-full py-2 text-center border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  View Home
                </Link>
              )}
            </div>
          </div>

          {/* Deposit Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Deposit Status</h3>
            {agreement.deposit_paid ? (
              <div>
                <Badge className="bg-green-100 text-green-800 mb-2">Paid</Badge>
                <p className="text-sm text-slate-600">
                  {formatCurrency(agreement.deposit_amount)} received on {formatDate(agreement.deposit_paid_date!)}
                </p>
                <p className="text-sm text-slate-500">
                  via {agreement.deposit_payment_method}
                </p>
              </div>
            ) : (
              <div>
                <Badge className="bg-yellow-100 text-yellow-800 mb-2">Pending</Badge>
                <p className="text-sm text-slate-600">
                  Deposit of {formatCurrency(agreement.deposit_amount)} not yet received
                </p>
                <button className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Record Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
