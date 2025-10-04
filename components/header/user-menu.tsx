"use client"

import { useState } from "react"
import { User, LogOut, Settings, ShoppingBag, Heart, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "../auth/auth-modal"
import Link from "next/link"

export function UserMenu() {
    const { user, logout } = useAuth()
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    if (!user) {
        return (
            <>
                <Button className="cursor-pointer bg-secondary rounded-full" variant="ghost" size="icon" onClick={() => setIsAuthModalOpen(true)}>
                    <User className="h-8 w-8 text-muted-foreground" />
                </Button>
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || `https://avatar.iran.liara.run/username?username=${user.name ? user.name?.split(" ")[0] : user.email?.charAt(0).toUpperCase()}`} alt={user.name as string} />
                        <AvatarFallback className="bg-primary text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {
                    user.role === "admin" && (
                        <DropdownMenuItem>
                            <Link href="/dashboard" className="flex items-center gap-x-2">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                            </Link>
                        </DropdownMenuItem>
                    )
                }
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
