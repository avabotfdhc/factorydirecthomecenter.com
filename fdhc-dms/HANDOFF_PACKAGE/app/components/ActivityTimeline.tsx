'use client'

import { Activity, Profile } from '@/app/types'
import { formatDate, formatPhoneNumber } from '@/app/lib/utils'
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  Calculator,
  FileText,
  RefreshCw,
  User,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

interface ActivityTimelineProps {
  activities: Activity[]
}

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PHONE_CALL: Phone,
  EMAIL: Mail,
  SMS: MessageSquare,
  APPOINTMENT: Calendar,
  SITE_VISIT: MapPin,
  DESKING: Calculator,
  NOTE: FileText,
  STATUS_CHANGE: RefreshCw,
}

const activityColors: Record<string, string> = {
  PHONE_CALL: 'bg-blue-100 text-blue-600',
  EMAIL: 'bg-purple-100 text-purple-600',
  SMS: 'bg-green-100 text-green-600',
  APPOINTMENT: 'bg-amber-100 text-amber-600',
  SITE_VISIT: 'bg-cyan-100 text-cyan-600',
  DESKING: 'bg-indigo-100 text-indigo-600',
  NOTE: 'bg-slate-100 text-slate-600',
  STATUS_CHANGE: 'bg-orange-100 text-orange-600',
}

const directionIcons = {
  INBOUND: <ArrowRight className="w-3 h-3" />,
  OUTBOUND: <ArrowLeft className="w-3 h-3" />,
}

const outcomeLabels: Record<string, string> = {
  NO_ANSWER: 'No Answer',
  VOICEMAIL: 'Voicemail',
  CONNECTED: 'Connected',
  APPOINTMENT_SET: 'Appointment Set',
  NOT_INTERESTED: 'Not Interested',
  CALLBACK_REQUESTED: 'Callback Requested',
  DEAL_MADE: 'Deal Made',
  FOLLOW_UP_LATER: 'Follow Up Later',
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>No activities yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Activities will appear here when you log calls, emails, or meetings.
        </p>
      </div>
    )
  }

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type] || FileText
          const colorClass = activityColors[activity.type] || 'bg-slate-100 text-slate-600'
          const isLast = index === activities.length - 1

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-slate-900">
                          {activity.type.replace(/_/g, ' ')}
                        </span>
                        {activity.direction && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-500">
                            {directionIcons[activity.direction]}
                            {activity.direction.toLowerCase()}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {activity.user?.full_name || 'System'}
                        {' · '}
                        {formatDate(activity.created_at)}
                        {activity.duration_seconds && (
                          <span className="ml-2">
                            · {Math.floor(activity.duration_seconds / 60)}:
                            {String(activity.duration_seconds % 60).padStart(2, '0')}
                          </span>
                        )}
                      </p>
                    </div>
                    {activity.outcome && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {outcomeLabels[activity.outcome] || activity.outcome}
                        </span>
                      </div>
                    )}
                    {activity.notes && (
                      <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                        {activity.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
