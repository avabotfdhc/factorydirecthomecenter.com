"use client";

import { useState, useEffect } from "react";
import { SalesCampaign, loadCampaigns, saveCampaigns, addCampaign } from "@/lib/pricing";

export default function CampaignsAdminPage() {
  const [campaigns, setCampaigns] = useState<SalesCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    discountPercent: 5,
    applicableModels: "all",
    isActive: true,
  });

  useEffect(() => {
    const loaded = loadCampaigns();
    setCampaigns(loaded);
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign = addCampaign({
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      discountPercent: formData.discountPercent,
      applicableModels: formData.applicableModels.split(",").map(s => s.trim()),
      isActive: formData.isActive,
    });
    
    setCampaigns([...campaigns, newCampaign]);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      discountPercent: 5,
      applicableModels: "all",
      isActive: true,
    });
  };

  const toggleCampaign = (id: string) => {
    const updated = campaigns.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  const deleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  const isCampaignActive = (campaign: SalesCampaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    return campaign.isActive && now >= start && now <= end;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-gray)]">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-[var(--color-charcoal)] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-light">Sales Campaigns</h1>
              <p className="text-white/60 mt-1">Manage pricing campaigns and promotions</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-3 font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors"
            >
              {showForm ? "Cancel" : "+ New Campaign"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* New Campaign Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="font-serif text-2xl font-light mb-6">Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    placeholder="e.g., Spring Savings Event"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                    Discount Percentage
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="font-bold text-[var(--color-teal)] w-16 text-right">
                      {formData.discountPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of the campaign"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                  Applicable Models
                </label>
                <input
                  type="text"
                  value={formData.applicableModels}
                  onChange={(e) => setFormData({ ...formData, applicableModels: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                  placeholder="all OR 14*,16*,18* OR specific SKUs"
                />
                <p className="text-xs text-[var(--color-gray)] mt-1">
                  Use &quot;all&quot; for all models, wildcards like &quot;14*&quot; for single wides, or comma-separated SKUs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-[var(--color-teal)] rounded focus:ring-[var(--color-teal)]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-charcoal)]">
                  Activate immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[var(--color-teal)] text-white px-8 py-3 font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
                >
                  Create Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-200 text-[var(--color-charcoal)] px-8 py-3 font-bold tracking-wider uppercase rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns List */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-light mb-6">
            Active & Upcoming Campaigns ({campaigns.length})
          </h2>

          {campaigns.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-[var(--color-cream-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">No campaigns yet</h3>
              <p className="text-[var(--color-gray)] mb-4">Create your first sales campaign to start offering promotional pricing</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-[var(--color-teal)] font-semibold hover:text-[var(--color-teal-dark)]"
              >
                Create Campaign →
              </button>
            </div>
          ) : (
            campaigns.map((campaign) => {
              const active = isCampaignActive(campaign);
              return (
                <div
                  key={campaign.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${
                    active ? "border-[var(--color-lime)]" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        {active && (
                          <span className="px-2 py-1 bg-[var(--color-lime)] text-[var(--color-charcoal)] text-xs font-bold uppercase rounded">
                            Active
                          </span>
                        )}
                        {!active && campaign.isActive && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded">
                            Scheduled
                          </span>
                        )}
                        {!campaign.isActive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded">
                            Paused
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--color-gray)] text-sm mb-3">{campaign.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-[var(--color-charcoal)]">
                          <svg className="w-4 h-4 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {campaign.discountPercent}% off
                        </span>
                        <span className="flex items-center gap-1 text-[var(--color-charcoal)]">
                          <svg className="w-4 h-4 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-[var(--color-charcoal)]">
                          <svg className="w-4 h-4 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {campaign.applicableModels.join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleCampaign(campaign.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          campaign.isActive
                            ? "bg-[var(--color-lime)]/10 text-[var(--color-lime-dark)] hover:bg-[var(--color-lime)]/20"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={campaign.isActive ? "Pause campaign" : "Activate campaign"}
                      >
                        {campaign.isActive ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete campaign"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pricing Reference */}
        <div className="mt-12 bg-[var(--color-teal)]/5 rounded-xl p-8">
          <h2 className="font-serif text-xl font-light mb-4">Pricing Formula Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Factory Cost</h4>
              <p className="text-[var(--color-gray)]">Base Price + (Sq Ft × Surcharge)</p>
              <p className="text-[var(--color-gray)]">Surcharge: $0.50/sqft (singles), $0.65/sqft (sectional)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">MSRP</h4>
              <p className="text-[var(--color-gray)]">(Factory Cost + $2,500 Pack) × 1.65</p>
              <p className="text-[var(--color-gray)]">65% markup on cost + pack</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">FDHC Price</h4>
              <p className="text-[var(--color-gray)]">MSRP × 0.90</p>
              <p className="text-[var(--color-gray)]">10% off MSRP</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-teal)]/20">
            <h4 className="font-semibold mb-2">Sales Campaign Price</h4>
            <p className="text-[var(--color-gray)]">FDHC Price × (1 - Campaign Discount%)</p>
            <p className="text-[var(--color-gray)]">Additional discount off FDHC price for limited time</p>
          </div>
        </div>
      </main>
    </div>
  );
}
