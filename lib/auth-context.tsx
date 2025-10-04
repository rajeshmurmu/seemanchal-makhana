"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SessionUser } from "../types/types"
import { registerUser } from "./client/auth-api-client"
import { getSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface AuthContextType {
    user: SessionUser | null
    login: (email: string, password: string) => Promise<boolean>
    signup: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true)

            const result = await signIn("credentials", {
                redirect: false, // prevent full-page redirect
                email,
                password,
                callbackUrl: "/"
            })

            if (result?.error) {
                console.error("Login failed: " + result.error)
                toast.error("Login failed. Please try again.")
                return false
            }
            else {
                const session = await getSession()
                if (session) {
                    setUser(session.user)
                    localStorage.setItem("user", JSON.stringify(session.user))
                    if (session?.user?.role === "admin") {
                        router.push(result?.url || "/dashboard")
                        toast.success("You have been successfully logged in.")

                        return true
                    } else {
                        router.push(result?.url || "/")
                        toast.success("You have been successfully logged in.")

                        return true
                    }
                }
            }

            toast.success("You have been successfully logged in.")
            setIsLoading(false)
            router.push("/")
            return true
        } catch (error) {
            console.error("Error logging in:", error)
            return false

        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            const res = await registerUser({ name, email, password, })
            if (res.status !== 200) {
                console.error("Error logging in:", res.statusText)
                toast.error("Unable to create account. Please try again.")
                return false

            }



            // login user automatically
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/"
            })

            // if login failed redirect to login
            if (result?.error) {
                console.error("Login failed: " + result?.error)
                toast.error("Account created successfully... please login.")
                router.push("/auth/login")
                return true

            }

            // if login success get the session and store the user in localstorage
            const session = await getSession()
            if (session) {
                setUser(session.user)
                localStorage.setItem("user", JSON.stringify(session.user))
                if (session?.user?.role === "admin") {
                    router.push(result?.url || "/dashboard")
                    toast.success("You have been successfully logged in.")
                    return true
                } else {
                    router.push(result?.url || "/")
                    toast.success("You have been successfully logged in.")

                    return true
                }
            }

            setIsLoading(false)
            toast.success("You have been registered and logged in successfully.")
            router.push(result?.url || "/")
            return true
        } catch (error) {
            console.error("Error logging in:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        const result = await signOut({
            redirect: false,
            callbackUrl: "/",
        })
        setUser(null)
        localStorage.removeItem("user")
        router.push(result.url || "/")
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
