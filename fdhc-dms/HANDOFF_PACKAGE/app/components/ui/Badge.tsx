import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import type { LeadStatus, DealStatus, HomeStatus } from '@/app/types'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      neutral: 'bg-slate-100 text-slate-800',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Lead status badge mapping
const leadStatusConfig: Record<LeadStatus, { variant: BadgeProps['variant']; label: string }> = {
  NEW: { variant: 'info', label: 'New' },
  CONTACTING: { variant: 'warning', label: 'Contacting' },
  QUALIFIED: { variant: 'success', label: 'Qualified' },
  APPOINTMENT_SET: { variant: 'info', label: 'Appointment Set' },
  SHOWN: { variant: 'neutral', label: 'Shown' },
  WORKING: { variant: 'warning', label: 'Working' },
  CLOSED_WON: { variant: 'success', label: 'Closed Won' },
  CLOSED_LOST: { variant: 'error', label: 'Closed Lost' },
  DEAD: { variant: 'neutral', label: 'Dead' },
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = leadStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Deal status badge mapping
const dealStatusConfig: Record<DealStatus, { variant: BadgeProps['variant']; label: string }> = {
  PROSPECT: { variant: 'neutral', label: 'Prospect' },
  DESKING: { variant: 'warning', label: 'Desking' },
  APPLICATION: { variant: 'info', label: 'Application' },
  APPROVED: { variant: 'success', label: 'Approved' },
  DELIVERY_SCHEDULED: { variant: 'info', label: 'Delivery Scheduled' },
  DELIVERED: { variant: 'success', label: 'Delivered' },
  FUNDED: { variant: 'success', label: 'Funded' },
  DEAD: { variant: 'error', label: 'Dead' },
}

function DealStatusBadge({ status }: { status: DealStatus }) {
  const config = dealStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Home status badge mapping
const homeStatusConfig: Record<HomeStatus, { variant: BadgeProps['variant']; label: string }> = {
  factory_order: { variant: 'neutral', label: 'Factory Order' },
  in_production: { variant: 'warning', label: 'In Production' },
  in_transit: { variant: 'info', label: 'In Transit' },
  on_lot: { variant: 'success', label: 'On Lot' },
  reserved: { variant: 'warning', label: 'Reserved' },
  sold: { variant: 'success', label: 'Sold' },
  delivered: { variant: 'success', label: 'Delivered' },
}

function HomeStatusBadge({ status }: { status: HomeStatus }) {
  const config = homeStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export { Badge, LeadStatusBadge, DealStatusBadge, HomeStatusBadge }
