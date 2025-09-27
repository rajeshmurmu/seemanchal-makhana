import { BarChart3, Home, MessageCircle, Package, Settings, ShoppingCart, Users } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        testId: "link-dashboard"
    },
    {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
        testId: "link-products"
    },
    {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
        testId: "link-orders"
    },
    {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users,
        testId: "link-customers"
    },
    {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: MessageCircle,
        testId: "link-reviews"
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        testId: "link-settings"
    },
]

export function AdminSidebarMenu() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Package className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Admin Dashboard</p>
                        <p className="text-xs text-muted-foreground">Semmanchal Makhana</p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}