'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lead, LeadStatus } from '@/app/types'
import { LeadStatusBadge } from '@/app/components/ui/Badge'
import { Button } from '@/app/components/ui/Button'
import { formatDate, formatPhoneNumber } from '@/app/lib/utils'
import {
  Phone,
  Mail,
  Eye,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react'

interface LeadsTableProps {
  leads: Lead[]
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}

type SortField = 'name' | 'status' | 'source' | 'assigned_to' | 'created_at' | 'last_contact_at'

export function LeadsTable({
  leads,
  onSort,
  sortField: externalSortField,
  sortDirection: externalSortDirection,
}: LeadsTableProps) {
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader field="name">Lead</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="source">Source</SortHeader>
              <SortHeader field="assigned_to">Assigned To</SortHeader>
              <SortHeader field="created_at">Created</SortHeader>
              <SortHeader field="last_contact_at">Last Contact</SortHeader>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {lead.first_name} {lead.last_name}
                      </Link>
                      <p className="text-sm text-slate-500">
                        {formatPhoneNumber(lead.phone)}
                      </p>
                      {lead.email && (
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-700 capitalize">
                      {lead.source.replace(/_/g, ' ')}
                    </span>
                    {lead.source_detail && (
                      <p className="text-xs text-slate-400">{lead.source_detail}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-700">
                      {lead.assigned_profile?.full_name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">
                      {lead.last_contact_at
                        ? formatDate(lead.last_contact_at)
                        : 'Never'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call"
                        aria-label={`Call ${lead.first_name} ${lead.last_name}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Email"
                          aria-label={`Email ${lead.first_name} ${lead.last_name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/leads/${lead.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                        aria-label={`View ${lead.first_name} ${lead.last_name}`}
                      >
                        <Eye className="w-4 h-4" />
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
