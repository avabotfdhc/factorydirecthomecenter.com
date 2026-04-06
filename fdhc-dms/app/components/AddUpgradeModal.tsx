'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (upgrade: {
    category: string
    description: string
    manufacturer?: string
    model_number?: string
    retail_price: number
    dealer_cost?: number
    installation_cost: number
    installed_by?: string
    warranty_period_months?: number
  }) => Promise<void>
}

const categories = [
  { value: 'appliance', label: 'Appliance' },
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'structural', label: 'Structural' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'other', label: 'Other' },
]

const installers = [
  { value: 'factory', label: 'Factory Installed' },
  { value: 'dealer', label: 'Dealer Installed' },
  { value: 'third_party', label: 'Third Party' },
]

export function AddUpgradeModal({ isOpen, onClose, onAdd }: AddUpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    manufacturer: '',
    model_number: '',
    retail_price: 0,
    dealer_cost: 0,
    installation_cost: 0,
    installed_by: 'factory',
    warranty_period_months: 12,
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onAdd(formData)
    setLoading(false)
    onClose()
    // Reset form
    setFormData({
      category: '',
      description: '',
      manufacturer: '',
      model_number: '',
      retail_price: 0,
      dealer_cost: 0,
      installation_cost: 0,
      installed_by: 'factory',
      warranty_period_months: 12,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900">Add Optional Upgrade</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Stainless steel refrigerator with ice maker"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Whirlpool"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
              <input
                type="text"
                value={formData.model_number}
                onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., WRF535SWHZ"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.retail_price || ''}
                onChange={(e) => setFormData({ ...formData, retail_price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Cost</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.installation_cost || ''}
                onChange={(e) => setFormData({ ...formData, installation_cost: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installed By</label>
              <select
                value={formData.installed_by}
                onChange={(e) => setFormData({ ...formData, installed_by: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {installers.map((inst) => (
                  <option key={inst.value} value={inst.value}>{inst.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty (months)</label>
              <input
                type="number"
                min="0"
                value={formData.warranty_period_months}
                onChange={(e) => setFormData({ ...formData, warranty_period_months: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Upgrade'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
