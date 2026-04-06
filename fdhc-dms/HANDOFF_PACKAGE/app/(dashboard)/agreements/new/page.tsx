"use client";

import { useState, useEffect } from "react";
import { createPurchaseAgreement } from "@/app/actions/purchase-agreements";
import { getLeads } from "@/app/actions/lead-routing";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewAgreementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    lead_id: "",
    deal_id: "",
    deposit_amount: 1000,
    deposit_payment_method: "",
    site_address: "",
    site_city: "",
    site_state: "",
    site_zip: "",
    expected_delivery_date: "",
    special_terms: "",
    included_options: [] as string[],
  });

  // Load leads on mount
  useEffect(() => {
    const loadLeads = async () => {
      const result = await getLeads({ status: "WORKING" });
      if (result.success) {
        setLeads(result.data || []);
      }
    };
    loadLeads();
  }, []);

  // Load deals when lead is selected
  useEffect(() => {
    if (formData.lead_id) {
      const lead = leads.find(l => l.id === formData.lead_id);
      setSelectedLead(lead);
      // In production, you'd fetch deals for this lead
      // For now, we'll use mock data or fetch from API
    }
  }, [formData.lead_id, leads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Get current user (in production, this comes from auth context)
      const result = await createPurchaseAgreement({
        ...formData,
        org_id: "00000000-0000-0000-0000-000000000000", // Replace with actual org ID
        lead_id: formData.lead_id,
        created_by: "00000000-0000-0000-0000-000000000000", // Replace with actual user ID
      });

      if (result.success) {
        router.push(`/dashboard/agreements/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create agreement");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/agreements"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={18} />
          Back to Agreements
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Create Purchase Agreement
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Client *
              </label>
              <select
                required
                value={formData.lead_id}
                onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a client...</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.first_name} {lead.last_name} - {lead.phone}
                  </option>
                ))}
              </select>
            </div>

            {selectedLead && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Client:</strong> {selectedLead.first_name} {selectedLead.last_name}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Phone:</strong> {selectedLead.phone}
                </p>
                {selectedLead.email && (
                  <p className="text-sm text-slate-600">
                    <strong>Email:</strong> {selectedLead.email}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Deal Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Deal Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Deal *
              </label>
              <select
                required
                value={formData.deal_id}
                onChange={(e) => setFormData({ ...formData, deal_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a deal...</option>
                {/* Deals would be populated based on selected lead */}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Financial terms will be auto-populated from the selected deal
              </p>
            </div>
          </div>

          {/* Deposit */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Deposit</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Amount *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  required
                  value={formData.deposit_payment_method}
                  onChange={(e) => setFormData({ ...formData, deposit_payment_method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="wire_transfer">Wire Transfer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Site Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Address
                </label>
                <input
                  type="text"
                  value={formData.site_address}
                  onChange={(e) => setFormData({ ...formData, site_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address where home will be placed"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.site_city}
                    onChange={(e) => setFormData({ ...formData, site_city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.site_state}
                    onChange={(e) => setFormData({ ...formData, site_state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={formData.site_zip}
                    onChange={(e) => setFormData({ ...formData, site_zip: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Terms */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Delivery & Terms</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expected_delivery_date}
                  onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Terms
                </label>
                <textarea
                  rows={4}
                  value={formData.special_terms}
                  onChange={(e) => setFormData({ ...formData, special_terms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special terms or conditions..."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? "Creating..." : "Create Purchase Agreement"}
            </button>
            <Link
              href="/dashboard/agreements"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
