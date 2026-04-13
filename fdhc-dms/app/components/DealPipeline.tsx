'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Deal, DealStatus } from '@/app/types'
import { DealStatusBadge } from '@/app/components/ui/Badge'
import { formatCurrency, formatDate } from '@/app/lib/utils'
import { MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react'

interface DealPipelineProps {
  deals: Deal[]
  onDealMove?: (dealId: string, newStatus: DealStatus) => void
}

const pipelineColumns: { status: DealStatus; title: string; color: string }[] = [
  { status: 'PROSPECT', title: 'Prospect', color: 'bg-slate-100' },
  { status: 'DESKING', title: 'Desking', color: 'bg-amber-50' },
  { status: 'APPLICATION', title: 'Application', color: 'bg-blue-50' },
  { status: 'APPROVED', title: 'Approved', color: 'bg-green-50' },
  { status: 'DELIVERY_SCHEDULED', title: 'Delivery Scheduled', color: 'bg-purple-50' },
  { status: 'DELIVERED', title: 'Delivered', color: 'bg-cyan-50' },
  { status: 'FUNDED', title: 'Funded', color: 'bg-emerald-50' },
]

export function DealPipeline({ deals, onDealMove }: DealPipelineProps) {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)

  const getDealsByStatus = (status: DealStatus) => {
    return deals.filter((deal) => deal.status === status)
  }

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: DealStatus) => {
    e.preventDefault()
    if (draggedDeal) {
      onDealMove?.(draggedDeal, status)
      setDraggedDeal(null)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {pipelineColumns.map((column) => {
        const columnDeals = getDealsByStatus(column.status)
        
        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <div className={`${column.color} rounded-t-lg p-3 border-b-2 border-slate-200`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{column.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-sm font-medium text-slate-600">
                  {columnDeals.length}
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-b-lg p-3 min-h-[400px] space-y-3">
              {columnDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  draggable={!!onDealMove}
                  onDragStart={() => handleDragStart(deal.id)}
                />
              ))}
              
              {columnDeals.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No deals
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DealCard({
  deal,
  draggable,
  onDragStart,
}: {
  deal: Deal
  draggable: boolean
  onDragStart: () => void
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <Link
          href={`/deals/${deal.id}`}
          className="font-medium text-slate-900 hover:text-blue-600"
        >
          {deal.lead?.first_name} {deal.lead?.last_name}
        </Link>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {deal.home && (
        <p className="text-sm text-slate-500 mb-2">
          {deal.home.manufacturer} {deal.home.model_name}
        </p>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-900">
          {deal.monthly_payment
            ? formatCurrency(deal.monthly_payment) + '/mo'
            : 'No payment set'}
        </span>
        {deal.loan_type && (
          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
            {deal.loan_type}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {deal.lead?.phone && (
          <a
            href={`tel:${deal.lead.phone}`}
            className="p-1 hover:bg-slate-100 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3 h-3" />
          </a>
        )}
        {deal.lead?.email && (
          <a
            href={`mailto:${deal.lead.email}`}
            className="p-1 hover:bg-slate-100 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-3 h-3" />
          </a>
        )}
        {deal.delivery_date && (
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {formatDate(deal.delivery_date)}
          </span>
        )}
      </div>
    </div>
  )
}
