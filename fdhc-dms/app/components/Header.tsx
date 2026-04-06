'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/components/AuthProvider'
import { Button } from '@/app/components/ui/Button'
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface HeaderProps {
  isSidebarCollapsed: boolean
}

export function Header({ isSidebarCollapsed }: HeaderProps) {
  const { profile, signOut, isLoading } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-30',
        'transition-all duration-300',
        isSidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, deals, inventory..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                      <p className="text-sm font-medium text-slate-900">
                        New lead assigned
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        John Smith has been assigned to you
                      </p>
                      <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                    </div>
                    <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                      <p className="text-sm font-medium text-slate-900">
                        Appointment reminder
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Meeting with Sarah Johnson at 2:00 PM
                      </p>
                      <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-100">
                    <Link
                      href="/notifications"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {profile?.full_name || 'User'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-1">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {profile?.email || ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">
                      {profile?.role?.replace('_', ' ') || 'User'}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-slate-100 mt-1">
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
