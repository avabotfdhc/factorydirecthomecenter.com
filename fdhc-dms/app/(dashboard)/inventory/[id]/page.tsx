'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { HomeInventory, HomeStatus } from '@/app/types'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { HomeStatusBadge } from '@/app/components/ui/Badge'
import { useSuccessToast, useErrorToast } from '@/app/components/ui/Toast'
import { createClient } from '@/app/lib/supabase/client'
import { formatCurrency, formatDate } from '@/app/lib/utils'
import {
  ArrowLeft,
  Edit,
  Home,
  Ruler,
  Bed,
  Bath,
  Calendar,
  DollarSign,
  Truck,
  Package,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'

const supabase = createClient()

const statusOptions: { value: HomeStatus; label: string }[] = [
  { value: 'factory_order', label: 'Factory Order' },
  { value: 'in_production', label: 'In Production' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'on_lot', label: 'On Lot' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
  { value: 'delivered', label: 'Delivered' },
]

export default function HomeDetailPage() {
  const params = useParams()
  const homeId = params.id as string

  const [home, setHome] = useState<HomeInventory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const fetchHome = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('home_inventory')
        .select('*')
        .eq('id', homeId)
        .single()

      if (error) throw error
      setHome(data as HomeInventory)
    } catch (err) {
      errorToast('Failed to load home details')
    } finally {
      setIsLoading(false)
    }
  }, [homeId])

  useEffect(() => {
    fetchHome()
  }, [fetchHome])

  const handleStatusChange = async (newStatus: HomeStatus) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('home_inventory')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', homeId)

      if (error) throw error

      successToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
      fetchHome()
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

  if (!home) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Home not found</p>
        <Link href="/inventory" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to inventory
        </Link>
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    single_wide: 'Single Wide',
    double_wide: 'Double Wide',
    triple_wide: 'Triple Wide',
    modular: 'Modular',
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/inventory"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Inventory
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {home.manufacturer} {home.model_name}
            </h1>
            <HomeStatusBadge status={home.status} />
          </div>
          <p className="text-slate-500 mt-1">
            {categoryLabels[home.category]} · Added {formatDate(home.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button leftIcon={<Edit className="w-4 h-4" />}>
            Edit Home
          </Button>
        </div>
      </div>

      {/* Images Placeholder */}
      <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500">No images available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Home Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Home Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Square Feet</p>
                    <p className="font-medium text-slate-900">
                      {home.square_feet ? home.square_feet.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bed className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Bedrooms</p>
                    <p className="font-medium text-slate-900">
                      {home.bedrooms || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bath className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Bathrooms</p>
                    <p className="font-medium text-slate-900">
                      {home.bathrooms || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Year</p>
                    <p className="font-medium text-slate-900">
                      {home.year || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Serial Number</p>
                    <p className="font-medium text-slate-900">
                      {home.serial_number || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">HUD Label</p>
                    <p className="font-medium text-slate-900">
                      {home.hud_label_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Base Invoice</span>
                  <span className="font-medium">{formatCurrency(home.base_invoice)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Pack Amount</span>
                  <span className="font-medium text-blue-600">
                    +{formatCurrency(home.pack_amount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Freight Cost</span>
                  <span className="font-medium">{formatCurrency(home.freight_cost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Setup Cost</span>
                  <span className="font-medium">{formatCurrency(home.setup_cost)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-slate-200">
                  <span className="font-semibold text-slate-900">List Price</span>
                  <span className="font-bold text-xl text-slate-900">
                    {formatCurrency(home.list_price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specs */}
          {home.specs && Object.keys(home.specs).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(home.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-slate-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={isUpdating || home.status === option.value}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      home.status === option.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {home.factory_order_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Factory Order</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(home.factory_order_date)}
                    </p>
                  </div>
                </div>
              )}
              {home.estimated_arrival && (
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Estimated Arrival</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(home.estimated_arrival)}
                    </p>
                  </div>
                </div>
              )}
              {home.actual_arrival && (
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Actual Arrival</p>
                    <p className="font-medium text-green-600">
                      {formatDate(home.actual_arrival)}
                    </p>
                  </div>
                </div>
              )}
              {!home.factory_order_date && !home.estimated_arrival && !home.actual_arrival && (
                <p className="text-slate-400 text-sm">No timeline information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
