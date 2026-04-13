'use client'

import { useState, useEffect } from 'react'
import { Deal, Lead, HomeInventory, DealStatus, LoanType } from '@/app/types'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Card, CardContent, CardFooter } from '@/app/components/ui/Card'
import { formatCurrency } from '@/app/lib/utils'

interface DealFormProps {
  initialData?: Partial<Deal>
  leads: Lead[]
  homes: HomeInventory[]
  onSubmit: (data: Partial<Deal>) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

const dealStatuses: { value: DealStatus; label: string }[] = [
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'DESKING', label: 'Desking' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DELIVERY_SCHEDULED', label: 'Delivery Scheduled' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'FUNDED', label: 'Funded' },
  { value: 'DEAD', label: 'Dead' },
]

const loanTypes: { value: LoanType; label: string }[] = [
  { value: 'CHATTEL', label: 'Chattel' },
  { value: 'LAND_HOME_FHA', label: 'Land-Home FHA' },
  { value: 'LAND_HOME_CONV', label: 'Land-Home Conventional' },
  { value: 'CASH', label: 'Cash' },
]

export function DealForm({
  initialData,
  leads,
  homes,
  onSubmit,
  onCancel,
  isLoading = false,
}: DealFormProps) {
  const [formData, setFormData] = useState<Partial<Deal>>({
    lead_id: initialData?.lead_id || '',
    home_id: initialData?.home_id || null,
    status: initialData?.status || 'PROSPECT',
    loan_type: initialData?.loan_type || null,
    lender_name: initialData?.lender_name || '',
    base_home_price: initialData?.base_home_price || null,
    factory_options_price: initialData?.factory_options_price || 0,
    freight_cost: initialData?.freight_cost || 0,
    setup_cost: initialData?.setup_cost || 0,
    site_prep_price: initialData?.site_prep_price || 0,
    trade_in_value: initialData?.trade_in_value || 0,
    down_payment: initialData?.down_payment || 0,
    interest_rate: initialData?.interest_rate || null,
    term_months: initialData?.term_months || null,
    monthly_payment: initialData?.monthly_payment || null,
    ...initialData,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Deal, string>>>({})

  const selectedHome = homes.find((h) => h.id === formData.home_id)

  useEffect(() => {
    if (selectedHome && !initialData?.base_home_price) {
      setFormData((prev) => ({
        ...prev,
        base_home_price: selectedHome.list_price,
      }))
    }
  }, [selectedHome, initialData])

  const calculateTotals = () => {
    const basePrice = formData.base_home_price || 0
    const options = formData.factory_options_price || 0
    const freight = formData.freight_cost || 0
    const setup = formData.setup_cost || 0
    const sitePrep = formData.site_prep_price || 0
    const tradeIn = formData.trade_in_value || 0
    const downPayment = formData.down_payment || 0

    const totalCost = basePrice + options + freight + setup + sitePrep
    const netCost = totalCost - tradeIn
    const amountFinanced = netCost - downPayment

    // Calculate monthly payment if rate and term are set
    let monthlyPayment = null
    if (formData.interest_rate && formData.term_months && amountFinanced > 0) {
      const monthlyRate = (formData.interest_rate / 100) / 12
      const numPayments = formData.term_months
      if (monthlyRate > 0) {
        const compoundFactor = Math.pow(1 + monthlyRate, numPayments)
        monthlyPayment = (amountFinanced * monthlyRate * compoundFactor) / (compoundFactor - 1)
      } else {
        monthlyPayment = amountFinanced / numPayments
      }
    }

    return { totalCost, netCost, amountFinanced, monthlyPayment }
  }

  const totals = calculateTotals()

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Deal, string>> = {}

    if (!formData.lead_id) {
      newErrors.lead_id = 'Please select a lead'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = {
      ...formData,
      monthly_payment: totals.monthlyPayment,
    }

    await onSubmit(submitData)
  }

  const handleChange = (field: keyof Deal, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const numberFields = [
    'base_home_price',
    'factory_options_price',
    'freight_cost',
    'setup_cost',
    'site_prep_price',
    'trade_in_value',
    'down_payment',
    'interest_rate',
    'term_months',
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Lead and Home Selection */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lead *
                </label>
                <Select
                  value={formData.lead_id || ''}
                  onChange={(e) => handleChange('lead_id', e.target.value)}
                  error={errors.lead_id}
                >
                  <option value="">Select a lead...</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.first_name} {lead.last_name} - {lead.phone}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Home
                </label>
                <Select
                  value={formData.home_id || ''}
                  onChange={(e) => handleChange('home_id', e.target.value || null)}
                >
                  <option value="">Select a home...</option>
                  {homes.map((home) => (
                    <option key={home.id} value={home.id}>
                      {home.manufacturer} {home.model_name} - {formatCurrency(home.list_price)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as DealStatus)}
                >
                  {dealStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Type
                </label>
                <Select
                  value={formData.loan_type || ''}
                  onChange={(e) =>
                    handleChange('loan_type', (e.target.value as LoanType) || null)
                  }
                >
                  <option value="">Select loan type...</option>
                  {loanTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {formData.loan_type && formData.loan_type !== 'CASH' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lender Name
                </label>
                <Input
                  value={formData.lender_name || ''}
                  onChange={(e) => handleChange('lender_name', e.target.value)}
                  placeholder="e.g., 21st Mortgage"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-semibold text-slate-900">Pricing Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Base Home Price
                </label>
                <Input
                  type="number"
                  value={formData.base_home_price || ''}
                  onChange={(e) =>
                    handleChange('base_home_price', parseFloat(e.target.value) || null)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Factory Options
                </label>
                <Input
                  type="number"
                  value={formData.factory_options_price || ''}
                  onChange={(e) =>
                    handleChange('factory_options_price', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Freight & Setup
                </label>
                <Input
                  type="number"
                  value={formData.freight_cost || ''}
                  onChange={(e) =>
                    handleChange('freight_cost', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Prep
                </label>
                <Input
                  type="number"
                  value={formData.site_prep_price || ''}
                  onChange={(e) =>
                    handleChange('site_prep_price', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trade-In Value
                </label>
                <Input
                  type="number"
                  value={formData.trade_in_value || ''}
                  onChange={(e) =>
                    handleChange('trade_in_value', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Down Payment
                </label>
                <Input
                  type="number"
                  value={formData.down_payment || ''}
                  onChange={(e) =>
                    handleChange('down_payment', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {formData.loan_type && formData.loan_type !== 'CASH' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.interest_rate || ''}
                    onChange={(e) =>
                      handleChange('interest_rate', parseFloat(e.target.value) || null)
                    }
                    placeholder="e.g., 7.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Term (Months)
                  </label>
                  <Input
                    type="number"
                    value={formData.term_months || ''}
                    onChange={(e) =>
                      handleChange('term_months', parseInt(e.target.value) || null)
                    }
                    placeholder="e.g., 240"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Deal Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Cost</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totals.totalCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Net After Trade</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totals.netCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Amount Financed</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totals.amountFinanced)}
                </p>
              </div>
              {totals.monthlyPayment && (
                <div>
                  <p className="text-sm text-slate-500">Monthly Payment</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(totals.monthlyPayment)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <CardFooter className="px-0">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            {initialData?.id ? 'Update Deal' : 'Create Deal'}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
