'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HomeInventory, HomeStatus, HomeCategory } from '@/app/types'
import { HomeStatusBadge } from '@/app/components/ui/Badge'
import { formatCurrency, formatDate } from '@/app/lib/utils'
import {
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
} from 'lucide-react'

interface InventoryTableProps {
  homes: HomeInventory[]
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  compact?: boolean
}

type SortField = 'manufacturer' | 'model_name' | 'status' | 'list_price' | 'created_at'

export function InventoryTable({
  homes,
  onSort,
  sortField: externalSortField,
  sortDirection: externalSortDirection,
  compact = false,
}: InventoryTableProps) {
  const [internalSortField, setInternalSortField] = useState<SortField>('created_at')
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortField = externalSortField || internalSortField
  const sortDirection = externalSortDirection || internalSortDirection

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'

    if (!externalSortField) {
      setInternalSortField(field)
      setInternalSortDirection(newDirection)
    }

    onSort?.(field, newDirection)
  }

  const SortHeader = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-300" />
        )}
      </div>
    </th>
  )

  const categoryLabels: Record<HomeCategory, string> = {
    single_wide: 'Single Wide',
    double_wide: 'Double Wide',
    triple_wide: 'Triple Wide',
    modular: 'Modular',
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader field="manufacturer">Home</SortHeader>
              {!compact && <SortHeader field="status">Status</SortHeader>}
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Details
              </th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Arrival
                </th>
              )}
              <SortHeader field="list_price">Price</SortHeader>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {homes.length === 0 ? (
              <tr>
                <td
                  colSpan={compact ? 4 : 6}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No homes in inventory
                </td>
              </tr>
            ) : (
              homes.map((home) => (
                <tr
                  key={home.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <Link
                        href={`/inventory/${home.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {home.manufacturer}
                      </Link>
                      <p className="text-sm text-slate-500">{home.model_name}</p>
                      {home.year && (
                        <p className="text-xs text-slate-400">{home.year}</p>
                      )}
                    </div>
                  </td>
                  {!compact && (
                    <td className="px-4 py-4">
                      <HomeStatusBadge status={home.status} />
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-600">
                      <p>{categoryLabels[home.category]}</p>
                      {home.bedrooms && home.bathrooms && (
                        <p className="text-slate-500">
                          {home.bedrooms} bed / {home.bathrooms} bath
                        </p>
                      )}
                      {home.square_feet && (
                        <p className="text-slate-500">{home.square_feet.toLocaleString()} sq ft</p>
                      )}
                    </div>
                  </td>
                  {!compact && (
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">
                        {home.estimated_arrival
                          ? formatDate(home.estimated_arrival)
                          : home.actual_arrival
                          ? formatDate(home.actual_arrival)
                          : 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <span className="font-medium text-slate-900">
                      {formatCurrency(home.list_price)}
                    </span>
                    <p className="text-xs text-slate-500">
                      Invoice: {formatCurrency(home.base_invoice)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/inventory/${home.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/inventory/${home.id}/edit`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
