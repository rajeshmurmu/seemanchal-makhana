
import { AdminSidebarMenu } from '@/app/(admin)/components/admin-sidebar-menu'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

export default function Dashboardlayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AdminSidebarMenu />
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger data-testid="button-sidebar-toggle" />
                        <h2 className="font-semibold text-lg">Seemanchal-Makhana Admin</h2>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
