'use client'

import { useState } from 'react'
import { Sidebar } from '@/app/components/Sidebar'
import { Header } from '@/app/components/Header'
import { cn } from '@/app/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header isSidebarCollapsed={isSidebarCollapsed} />
      
      <main
        className={cn(
          'pt-16 transition-all duration-300 min-h-screen',
          isSidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
