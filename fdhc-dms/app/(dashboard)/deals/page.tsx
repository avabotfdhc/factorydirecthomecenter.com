'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Deal, DealStatus } from '@/app/types'
import { DealPipeline } from '@/app/components/DealPipeline'
import { DealForm } from '@/app/components/DealForm'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Modal } from '@/app/components/ui/Modal'
import { useSuccessToast, useErrorToast } from '@/app/components/ui/Toast'
import { Plus, Search, List, LayoutGrid, Loader2 } from 'lucide-react'
import { createClient } from '@/app/lib/supabase/client'
import { formatCurrency } from '@/app/lib/utils'

const supabase = createClient()

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [homes, setHomes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const fetchDeals = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          lead:leads(id, first_name, last_name, phone, email),
          home:home_inventory(id, manufacturer, model_name, list_price)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDeals(data || [])
    } catch (err) {
      errorToast('Failed to load deals')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchLeadsAndHomes = async () => {
    try {
      const [leadsResult, homesResult] = await Promise.all([
        supabase.from('leads').select('id, first_name, last_name, phone').eq('status', 'QUALIFIED'),
        supabase.from('home_inventory').select('id, manufacturer, model_name, list_price').eq('status', 'on_lot'),
      ])
      
      if (leadsResult.data) setLeads(leadsResult.data)
      if (homesResult.data) setHomes(homesResult.data)
    } catch {
      // Silent fail
    }
  }

  useEffect(() => {
    fetchDeals()
    fetchLeadsAndHomes()
  }, [fetchDeals])

  const handleCreateDeal = async (formData: Partial<Deal>) => {
    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert(formData)
        .select()
        .single()

      if (error) throw error

      successToast('Deal created successfully')
      setIsCreateModalOpen(false)
      fetchDeals()
    } catch (err) {
      errorToast('Failed to create deal')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDealMove = async (dealId: string, newStatus: DealStatus) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', dealId)

      if (error) throw error

      successToast(`Deal moved to ${newStatus.replace(/_/g, ' ')}`)
      fetchDeals()
    } catch {
      errorToast('Failed to move deal')
    }
  }

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      !searchQuery ||
      `${deal.lead?.first_name} ${deal.lead?.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      deal.lead?.phone?.includes(searchQuery)
    
    const matchesStatus = !statusFilter || deal.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
          <p className="text-slate-500 mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Deal
          </Button>
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
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          >
            <option value="">All Statuses</option>
            <option value="PROSPECT">Prospect</option>
            <option value="DESKING">Desking</option>
            <option value="APPLICATION">Application</option>
            <option value="APPROVED">Approved</option>
            <option value="DELIVERY_SCHEDULED">Delivery Scheduled</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FUNDED">Funded</option>
            <option value="DEAD">Dead</option>
          </Select>
        </div>
      </div>

      {/* Deals View */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : viewMode === 'pipeline' ? (
        <DealPipeline deals={filteredDeals} onDealMove={handleDealMove} />
      ) : (
        <DealsList deals={filteredDeals} />
      )}

      {/* Create Deal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deal"
        description="Create a new deal for a qualified lead"
        size="full"
      >
        <DealForm
          leads={leads}
          homes={homes}
          onSubmit={handleCreateDeal}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>
    </div>
  )
}

// Simple list view for deals
function DealsList({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No deals found</h3>
        <p className="text-slate-500">Create your first deal to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Home</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deals.map((deal) => (
            <tr key={deal.id} className="hover:bg-slate-50">
              <td className="px-4 py-4">
                <Link href={`/deals/${deal.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                  {deal.lead?.first_name} {deal.lead?.last_name}
                </Link>
                <p className="text-sm text-slate-500">{deal.lead?.phone}</p>
              </td>
              <td className="px-4 py-4">
                {deal.home ? (
                  <>
                    <p className="text-sm text-slate-900">{deal.home.manufacturer}</p>
                    <p className="text-sm text-slate-500">{deal.home.model_name}</p>
                  </>
                ) : (
                  <span className="text-slate-400">No home selected</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {deal.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-4">
                {deal.monthly_payment ? (
                  <span className="font-medium text-slate-900">
                    {formatCurrency(deal.monthly_payment)}/mo
                  </span>
                ) : (
                  <span className="text-slate-400">Not set</span>
                )}
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  href={`/deals/${deal.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
