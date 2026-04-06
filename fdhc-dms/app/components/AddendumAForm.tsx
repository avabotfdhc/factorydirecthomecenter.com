'use client'

import { useState } from 'react'
import { AddUpgradeModal } from './AddUpgradeModal'
import { formatCurrency } from '@/app/lib/utils'
import { Trash2, Plus } from 'lucide-react'

interface Upgrade {
  id: string
  item_number: string
  category: string
  description: string
  manufacturer?: string
  model_number?: string
  retail_price: number
  installation_cost: number
  installed_by?: string
}

interface AddendumAFormProps {
  agreementId: string
  upgrades: Upgrade[]
  total: number
  onAddUpgrade: (upgrade: Omit<Upgrade, 'id' | 'item_number'>) => Promise<void>
  onRemoveUpgrade: (upgradeId: string) => Promise<void>
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

export function AddendumAForm({ 
  agreementId, 
  upgrades, 
  total, 
  onAddUpgrade, 
  onRemoveUpgrade 
}: AddendumAFormProps) {
  const [showModal, setShowModal] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const handleRemove = async (upgradeId: string) => {
    setRemoving(upgradeId)
    await onRemoveUpgrade(upgradeId)
    setRemoving(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Addendum A - Optional Upgrades</h2>
          <p className="text-sm text-slate-500">Custom upgrades and options selected by the buyer</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Upgrade
        </button>
      </div>

      {upgrades.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-slate-500">No upgrades added yet</p>
          <p className="text-sm text-slate-400">Click "Add Upgrade" to include optional items</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Install</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upgrades.map((upgrade) => (
                <tr key={upgrade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{upgrade.item_number}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {categories.find(c => c.value === upgrade.category)?.label || upgrade.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">{upgrade.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{upgrade.manufacturer || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(upgrade.retail_price)}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(upgrade.installation_cost)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">{formatCurrency(upgrade.retail_price + upgrade.installation_cost)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemove(upgrade.id)}
                      disabled={removing === upgrade.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-right font-semibold text-slate-900">Addendum A Total:</td>
                <td className="px-4 py-3 text-right font-bold text-lg text-blue-600">{formatCurrency(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <AddUpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={onAddUpgrade}
      />
    </div>
  )
}
