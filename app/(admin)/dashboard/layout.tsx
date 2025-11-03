
import { AdminSidebarMenu } from '@/app/(admin)/components/admin-sidebar-menu'
import { UserMenu } from '@/components/header/user-menu'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import React from 'react'

export default function Dashboardlayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AdminSidebarMenu />
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2 w-full justify-between">
                        <div className='flex items-center gap-2'>
                            <SidebarTrigger data-testid="button-sidebar-toggle" />
                            <h2 className="font-semibold text-lg">Munna Mart Admin</h2>
                        </div>
                        <div className='flex items-center justify-center h-full gap-2'>
                            <UserMenu />
                            <div className='bg-primary text-primary-foreground text-sm px-2 py-2 rounded cursor-pointer'>
                                <Link href={"/"} target='_blank' >View Website</Link>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
