'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lead, Activity, Deal } from '@/app/types'
import { ActivityTimeline } from '@/app/components/ActivityTimeline'
import { LeadForm } from '@/app/components/LeadForm'
import { Button } from '@/app/components/ui/Button'
import { Select } from '@/app/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/Card'
import { Badge, LeadStatusBadge } from '@/app/components/ui/Badge'
import { Modal } from '@/app/components/ui/Modal'
import { useToast, useSuccessToast, useErrorToast } from '@/app/components/ui/Toast'
import { getLeadById, updateLead, logActivity } from '@/app/actions/lead-routing'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Plus,
  Loader2,
  User,
  Home,
  Clock,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
} from 'lucide-react'
import { formatDate, formatPhoneNumber } from '@/app/lib/utils'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoggingActivity, setIsLoggingActivity] = useState(false)

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const fetchLead = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getLeadById(leadId)
      if (result.success && result.data) {
        setLead(result.data as Lead)
      } else {
        errorToast('Failed to load lead', result.error)
      }
    } catch {
      errorToast('Failed to load lead')
    } finally {
      setIsLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const handleUpdateLead = async (formData: any) => {
    setIsUpdating(true)
    try {
      const result = await updateLead(leadId, formData)
      if (result.success) {
        successToast('Lead updated successfully')
        setIsEditModalOpen(false)
        fetchLead()
      } else {
        errorToast('Failed to update lead', result.error)
      }
    } catch {
      errorToast('Failed to update lead')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogActivity = async (activityData: any) => {
    setIsLoggingActivity(true)
    try {
      const result = await logActivity({
        lead_id: leadId,
        user_id: 'current-user-id', // This should come from auth context
        ...activityData,
      })
      if (result.success) {
        successToast('Activity logged successfully')
        setIsActivityModalOpen(false)
        fetchLead()
      } else {
        errorToast('Failed to log activity', result.error)
      }
    } catch {
      errorToast('Failed to log activity')
    } finally {
      setIsLoggingActivity(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Lead not found</p>
        <Link href="/leads" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    )
  }

  const activities = (lead as any).activities || []

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/leads"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {lead.first_name} {lead.last_name}
            </h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="text-slate-500 mt-1">
            Lead since {formatDate(lead.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<Phone className="w-4 h-4" />}
            onClick={() => setIsActivityModalOpen(true)}
          >
            Log Call
          </Button>
          <Button
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-slate-900 font-medium hover:text-blue-600"
                      >
                        {formatPhoneNumber(lead.phone)}
                      </a>
                      {lead.alt_phone && (
                        <p className="text-sm text-slate-600 mt-1">
                          Alt: {formatPhoneNumber(lead.alt_phone)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-slate-900 font-medium hover:text-blue-600"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <p className="text-slate-400">No email provided</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Land Location</p>
                      <p className="text-slate-900">
                        {lead.land_location || 'Not specified'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1 capitalize">
                        {lead.land_status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Assigned To</p>
                      <p className="text-slate-900 font-medium">
                        {lead.assigned_profile?.full_name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Source</p>
                      <p className="text-slate-900 capitalize">
                        {lead.source.replace(/_/g, ' ')}
                      </p>
                      {lead.source_detail && (
                        <p className="text-sm text-slate-600">{lead.source_detail}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Target Move-in</p>
                      <p className="text-slate-900">
                        {lead.target_move_in
                          ? formatDate(lead.target_move_in)
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader
              action={
                <Button
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsActivityModalOpen(true)}
                >
                  Log Activity
                </Button>
              }
            >
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Contact Attempts</span>
                <span className="font-medium">{lead.contact_attempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Lead Score</span>
                <span className="font-medium">{lead.score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Last Contact</span>
                <span className="font-medium">
                  {lead.last_contact_at ? formatDate(lead.last_contact_at) : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Next Follow-up</span>
                <span className="font-medium">
                  {lead.next_follow_up_at
                    ? formatDate(lead.next_follow_up_at)
                    : 'Not scheduled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Create Deal Card */}
          <Card>
            <CardHeader>
              <CardTitle>Deal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                No active deal for this lead yet.
              </p>
              <Button className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                Create Deal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Lead"
        size="lg"
      >
        <LeadForm
          initialData={lead as any}
          onSubmit={handleUpdateLead}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isUpdating}
        />
      </Modal>

      {/* Log Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Log Activity"
        size="md"
      >
        <ActivityForm
          onSubmit={handleLogActivity}
          onCancel={() => setIsActivityModalOpen(false)}
          isLoading={isLoggingActivity}
        />
      </Modal>
    </div>
  )
}

// Activity Form Component
function ActivityForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    type: 'PHONE_CALL',
    direction: 'OUTBOUND',
    outcome: '',
    notes: '',
    duration_seconds: '',
  })

  const activityTypes = [
    { value: 'PHONE_CALL', label: 'Phone Call' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'APPOINTMENT', label: 'Appointment' },
    { value: 'SITE_VISIT', label: 'Site Visit' },
    { value: 'NOTE', label: 'Note' },
  ]

  const directions = [
    { value: 'OUTBOUND', label: 'Outbound' },
    { value: 'INBOUND', label: 'Inbound' },
  ]

  const outcomes = [
    { value: '', label: 'Select outcome...' },
    { value: 'NO_ANSWER', label: 'No Answer' },
    { value: 'VOICEMAIL', label: 'Voicemail' },
    { value: 'CONNECTED', label: 'Connected' },
    { value: 'APPOINTMENT_SET', label: 'Appointment Set' },
    { value: 'NOT_INTERESTED', label: 'Not Interested' },
    { value: 'CALLBACK_REQUESTED', label: 'Callback Requested' },
    { value: 'FOLLOW_UP_LATER', label: 'Follow Up Later' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      duration_seconds: formData.duration_seconds
        ? parseInt(formData.duration_seconds)
        : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Activity Type
          </label>
          <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {activityTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Direction
          </label>
          <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.direction}
            onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
          >
            {directions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Outcome
        </label>
        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.outcome}
          onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
        >
          {outcomes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {formData.type === 'PHONE_CALL' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={formData.duration_seconds}
            onChange={(e) =>
              setFormData({ ...formData, duration_seconds: e.target.value })
            }
            placeholder="e.g., 300"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter activity notes..."
          rows={4}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Log Activity
        </Button>
      </div>
    </form>
  )
}
