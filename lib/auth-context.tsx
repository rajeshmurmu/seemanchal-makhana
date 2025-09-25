"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    signup: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication - in real app, this would be an API call
        if (email && password) {
            const mockUser: User = {
                id: "1",
                name: email.split("@")[0],
                email: email,
                avatar: "/diverse-user-avatars.png",
            }

            setUser(mockUser)
            localStorage.setItem("user", JSON.stringify(mockUser))
            setIsLoading(false)
            return true
        }

        setIsLoading(false)
        return false
    }

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock registration - in real app, this would be an API call
        if (name && email && password) {
            const mockUser: User = {
                id: Date.now().toString(),
                name: name,
                email: email,
                avatar: "/diverse-user-avatars.png",
            }

            setUser(mockUser)
            localStorage.setItem("user", JSON.stringify(mockUser))
            setIsLoading(false)
            return true
        }

        setIsLoading(false)
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
    }

    return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
