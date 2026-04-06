'use client'

import { useState } from 'react'
import { LeadFormData, LandStatus } from '@/app/types'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Card, CardContent, CardFooter } from '@/app/components/ui/Card'
import { Loader2 } from 'lucide-react'

interface LeadFormProps {
  initialData?: Partial<LeadFormData>
  onSubmit: (data: LeadFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

const landStatusOptions: { value: LandStatus; label: string }[] = [
  { value: 'OWNS_LAND', label: 'Owns Land' },
  { value: 'BUYING_LAND', label: 'Buying Land' },
  { value: 'NEEDS_PARK', label: 'Needs Park/MHC' },
  { value: 'UNDECIDED', label: 'Undecided' },
]

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'phone', label: 'Phone' },
  { value: 'other', label: 'Other' },
]

export function LeadForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    source: initialData?.source || 'website',
    land_status: initialData?.land_status || 'UNDECIDED',
    land_location: initialData?.land_location || '',
    target_move_in: initialData?.target_move_in || '',
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    await onSubmit(formData)
  }

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name *
              </label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="John"
                error={errors.first_name}
                aria-label="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name *
              </label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Smith"
                error={errors.last_name}
                aria-label="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                error={errors.phone}
                aria-label="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                error={errors.email}
                aria-label="Email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lead Source
              </label>
              <Select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                aria-label="Lead source"
              >
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Land Status
              </label>
              <Select
                value={formData.land_status}
                onChange={(e) => handleChange('land_status', e.target.value as LandStatus)}
                aria-label="Land status"
              >
                {landStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Land Location
              </label>
              <Input
                value={formData.land_location}
                onChange={(e) => handleChange('land_location', e.target.value)}
                placeholder="City, State"
                aria-label="Land location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Move-in Date
              </label>
              <Input
                type="date"
                value={formData.target_move_in}
                onChange={(e) => handleChange('target_move_in', e.target.value)}
                aria-label="Target move-in date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this lead..."
              rows={4}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              aria-label="Notes"
            />
          </div>
        </CardContent>

        <CardFooter>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Lead' : 'Create Lead'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
