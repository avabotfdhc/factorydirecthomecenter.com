'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/lib/utils'
import {
  LayoutDashboard,
  Users,
  Handshake,
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Deals', href: '/dashboard/deals', icon: Handshake },
  { name: 'Agreements', href: '/dashboard/agreements', icon: FileText },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Home },
  { name: 'Desking', href: '/desking', icon: BarChart3 },
]

const bottomNavigation: NavItem[] = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          isCollapsed && 'justify-center px-2'
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <Icon className={cn('flex-shrink-0', isCollapsed ? 'w-6 h-6' : 'w-5 h-5')} />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40',
          'transition-all duration-300 ease-in-out',
          'flex flex-col',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'h-16 flex items-center border-b border-slate-200',
          isCollapsed ? 'justify-center px-2' : 'px-4'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-slate-900 truncate">FDHC DMS</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 py-4 px-2 space-y-1">
          {bottomNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
          
          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={onToggle}
            className={cn(
              'hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
              'text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors',
              isCollapsed && 'justify-center px-2'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
