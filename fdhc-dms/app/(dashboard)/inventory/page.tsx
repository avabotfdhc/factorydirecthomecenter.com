'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { HomeInventory, HomeStatus, HomeCategory } from '@/app/types'
import { InventoryTable } from '@/app/components/InventoryTable'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Modal } from '@/app/components/ui/Modal'
import { useSuccessToast, useErrorToast } from '@/app/components/ui/Toast'
import { Plus, Search, Download, Loader2, Home } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import { formatCurrency } from '@/app/lib/utils'

const supabase = createClient()

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'factory_order', label: 'Factory Order' },
  { value: 'in_production', label: 'In Production' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'on_lot', label: 'On Lot' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
  { value: 'delivered', label: 'Delivered' },
]

const categoryOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'single_wide', label: 'Single Wide' },
  { value: 'double_wide', label: 'Double Wide' },
  { value: 'triple_wide', label: 'Triple Wide' },
  { value: 'modular', label: 'Modular' },
]

export default function InventoryPage() {
  const [homes, setHomes] = useState<HomeInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  // Sorting
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const fetchInventory = useCallback(async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('home_inventory')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      if (categoryFilter) {
        query = query.eq('category', categoryFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setHomes(data || [])
    } catch (err) {
      errorToast('Failed to load inventory')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, categoryFilter])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const handleCreateHome = async (formData: Partial<HomeInventory>) => {
    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from('home_inventory')
        .insert(formData)
        .select()
        .single()

      if (error) throw error

      successToast('Home added to inventory')
      setIsCreateModalOpen(false)
      fetchInventory()
    } catch (err) {
      errorToast('Failed to add home')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field)
    setSortDirection(direction)
  }

  // Filter and sort homes
  const filteredHomes = homes
    .filter((home) => {
      const matchesSearch =
        !searchQuery ||
        home.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        home.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        home.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'manufacturer':
          comparison = a.manufacturer.localeCompare(b.manufacturer)
          break
        case 'model_name':
          comparison = a.model_name.localeCompare(b.model_name)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'list_price':
          comparison = a.list_price - b.list_price
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        default:
          comparison = 0
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

  // Pagination
  const totalPages = Math.ceil(filteredHomes.length / itemsPerPage)
  const paginatedHomes = filteredHomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = {
    total: homes.length,
    onLot: homes.filter((h) => h.status === 'on_lot').length,
    reserved: homes.filter((h) => h.status === 'reserved').length,
    inTransit: homes.filter((h) => h.status === 'in_transit').length,
    totalValue: homes.reduce((sum, h) => sum + h.list_price, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home Inventory</h1>
          <p className="text-slate-500 mt-1">
            Manage your home inventory and factory orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Home
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Homes</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">On Lot</p>
          <p className="text-2xl font-bold text-green-600">{stats.onLot}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Reserved</p>
          <p className="text-2xl font-bold text-amber-600">{stats.reserved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Inventory Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-40"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <InventoryTable
            homes={paginatedHomes}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredHomes.length)} of{' '}
                {filteredHomes.length} homes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Home Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Home to Inventory"
        description="Add a new home to your inventory"
        size="lg"
      >
        <HomeForm
          onSubmit={handleCreateHome}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>
    </div>
  )
}

// Home Form Component
function HomeForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: Partial<HomeInventory>) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<Partial<HomeInventory>>({
    manufacturer: '',
    model_name: '',
    category: 'double_wide',
    status: 'factory_order',
    base_invoice: 0,
    list_price: 0,
    pack_amount: 0,
    freight_cost: 0,
    setup_cost: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Manufacturer *
          </label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Model Name *
          </label>
          <input
            type="text"
            value={formData.model_name}
            onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as HomeCategory })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single_wide">Single Wide</option>
            <option value="double_wide">Double Wide</option>
            <option value="triple_wide">Triple Wide</option>
            <option value="modular">Modular</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as HomeStatus })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="factory_order">Factory Order</option>
            <option value="in_production">In Production</option>
            <option value="in_transit">In Transit</option>
            <option value="on_lot">On Lot</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Base Invoice
          </label>
          <input
            type="number"
            value={formData.base_invoice || ''}
            onChange={(e) => setFormData({ ...formData, base_invoice: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            List Price
          </label>
          <input
            type="number"
            value={formData.list_price || ''}
            onChange={(e) => setFormData({ ...formData, list_price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pack Amount
          </label>
          <input
            type="number"
            value={formData.pack_amount || ''}
            onChange={(e) => setFormData({ ...formData, pack_amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Freight Cost
          </label>
          <input
            type="number"
            value={formData.freight_cost || ''}
            onChange={(e) => setFormData({ ...formData, freight_cost: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Setup Cost
          </label>
          <input
            type="number"
            value={formData.setup_cost || ''}
            onChange={(e) => setFormData({ ...formData, setup_cost: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bedrooms
          </label>
          <input
            type="number"
            value={formData.bedrooms || ''}
            onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || null })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            value={formData.bathrooms || ''}
            onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || null })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Square Feet
          </label>
          <input
            type="number"
            value={formData.square_feet || ''}
            onChange={(e) => setFormData({ ...formData, square_feet: parseInt(e.target.value) || null })}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Serial Number
        </label>
        <input
          type="text"
          value={formData.serial_number || ''}
          onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., ABC123456"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Add Home
        </Button>
      </div>
    </form>
  )
}
