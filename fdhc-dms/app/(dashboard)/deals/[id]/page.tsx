'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Deal, DealStatus } from '@/app/types'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { DealStatusBadge } from '@/app/components/ui/Badge'
import { Modal } from '@/app/components/ui/Modal'
import { useSuccessToast, useErrorToast } from '@/app/components/ui/Toast'
import { createClient } from '@/app/lib/supabase/client'
import { formatCurrency, formatDate, formatPhoneNumber } from '@/app/lib/utils'
import DeskingMatrix from '@/app/components/DeskingMatrix'
import {
  ArrowLeft,
  Phone,
  Mail,
  Home,
  User,
  Calendar,
  DollarSign,
  Edit,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react'

const supabase = createClient()

const dealStatuses: DealStatus[] = [
  'PROSPECT',
  'DESKING',
  'APPLICATION',
  'APPROVED',
  'DELIVERY_SCHEDULED',
  'DELIVERED',
  'FUNDED',
  'DEAD',
]

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string

  const [deal, setDeal] = useState<Deal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDesking, setShowDesking] = useState(false)

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const fetchDeal = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          lead:leads(*),
          home:home_inventory(*)
        `)
        .eq('id', dealId)
        .single()

      if (error) throw error
      setDeal(data as Deal)
    } catch (err) {
      errorToast('Failed to load deal')
    } finally {
      setIsLoading(false)
    }
  }, [dealId])

  useEffect(() => {
    fetchDeal()
  }, [fetchDeal])

  const handleStatusChange = async (newStatus: DealStatus) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', dealId)

      if (error) throw error

      successToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
      fetchDeal()
    } catch (err) {
      errorToast('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Deal not found</p>
        <Link href="/deals" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to deals
        </Link>
      </div>
    )
  }

  const currentStatusIndex = dealStatuses.indexOf(deal.status)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/deals"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Deals
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Deal with {deal.lead?.first_name} {deal.lead?.last_name}
            </h1>
            <DealStatusBadge status={deal.status} />
          </div>
          <p className="text-slate-500 mt-1">
            Created {formatDate(deal.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDesking(!showDesking)}
          >
            {showDesking ? 'Hide Desking' : 'Open Desking'}
          </Button>
          <Button leftIcon={<Edit className="w-4 h-4" />}>
            Edit Deal
          </Button>
        </div>
      </div>

      {/* Status Workflow */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {dealStatuses.map((status, index) => {
              const isActive = index <= currentStatusIndex
              const isCurrent = status === deal.status

              return (
                <div key={status} className="flex items-center">
                  <button
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating}
                    className={`flex flex-col items-center gap-2 ${
                      isCurrent ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isActive && !isCurrent ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isCurrent
                          ? 'text-blue-600'
                          : isActive
                          ? 'text-green-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {status.replace(/_/g, ' ')}
                    </span>
                  </button>
                  {index < dealStatuses.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Desking Matrix (Conditional) */}
      {showDesking && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Deal Desking</h3>
          </div>
          <DeskingMatrix />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Customer</p>
                      <Link
                        href={`/leads/${deal.lead_id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {deal.lead?.first_name} {deal.lead?.last_name}
                      </Link>
                      <p className="text-sm text-slate-600">
                        {formatPhoneNumber(deal.lead?.phone || '')}
                      </p>
                      {deal.lead?.email && (
                        <p className="text-sm text-slate-600">{deal.lead.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Home</p>
                      {deal.home ? (
                        <>
                          <p className="font-medium text-slate-900">
                            {deal.home.manufacturer} {deal.home.model_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            List: {formatCurrency(deal.home.list_price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-slate-400">No home selected</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Loan Type</p>
                      <p className="font-medium text-slate-900">
                        {deal.loan_type || 'Not specified'}
                      </p>
                      {deal.lender_name && (
                        <p className="text-sm text-slate-600">{deal.lender_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Key Dates</p>
                      {deal.application_date && (
                        <p className="text-sm text-slate-600">
                          Applied: {formatDate(deal.application_date)}
                        </p>
                      )}
                      {deal.approval_date && (
                        <p className="text-sm text-slate-600">
                          Approved: {formatDate(deal.approval_date)}
                        </p>
                      )}
                      {deal.delivery_date && (
                        <p className="text-sm text-slate-600">
                          Delivery: {formatDate(deal.delivery_date)}
                        </p>
                      )}
                      {deal.funding_date && (
                        <p className="text-sm text-slate-600">
                          Funded: {formatDate(deal.funding_date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Base Home Price</span>
                  <span className="font-medium">
                    {formatCurrency(deal.base_home_price || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Factory Options</span>
                  <span className="font-medium">
                    {formatCurrency(deal.factory_options_price)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Freight & Setup</span>
                  <span className="font-medium">
                    {formatCurrency(deal.freight_cost + deal.setup_cost)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Site Prep</span>
                  <span className="font-medium">
                    {formatCurrency(deal.site_prep_price)}
                  </span>
                </div>
                {deal.trade_in_value > 0 && (
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Trade-In</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(deal.trade_in_value)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-slate-200">
                  <span className="font-semibold text-slate-900">Total Cost</span>
                  <span className="font-bold text-lg text-slate-900">
                    {formatCurrency(
                      (deal.base_home_price || 0) +
                        deal.factory_options_price +
                        deal.freight_cost +
                        deal.setup_cost +
                        deal.site_prep_price -
                        deal.trade_in_value
                    )}
                  </span>
                </div>
                {deal.down_payment > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Down Payment</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(deal.down_payment)}
                    </span>
                  </div>
                )}
                {deal.monthly_payment && (
                  <div className="flex justify-between py-3 bg-blue-50 -mx-6 px-6 rounded-lg">
                    <span className="font-semibold text-blue-900">Monthly Payment</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatCurrency(deal.monthly_payment)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                Call Customer
              </Button>
              <Button
                className="w-full"
                variant="outline"
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Send Email
              </Button>
              {deal.status !== 'DEAD' && (
                <Button
                  className="w-full"
                  variant="danger"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={() => handleStatusChange('DEAD')}
                  isLoading={isUpdating}
                >
                  Mark as Dead
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Deal Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deal.gross_profit !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Gross Profit</span>
                  <span className={`font-medium ${deal.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(deal.gross_profit)}
                  </span>
                </div>
              )}
              {deal.pack_earned !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Pack Earned</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(deal.pack_earned)}
                  </span>
                </div>
              )}
              {deal.commission_amount !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Commission</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(deal.commission_amount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Interest Rate</span>
                <span className="font-medium">
                  {deal.interest_rate ? `${deal.interest_rate}%` : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Term</span>
                <span className="font-medium">
                  {deal.term_months ? `${deal.term_months} months` : 'Not set'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
