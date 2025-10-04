"use client"
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { useAuth } from '@/lib/auth-context'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Auth() {
    const { page } = useParams<{ page: "login" | "signup" }>()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {

        if (user?.id || user?.email) {
            if (callbackUrl)
                router.push(callbackUrl);
            else
                router.push("/");
        }
    }, [callbackUrl, router, user])

    return (
        <div className='min-h-screen flex items-center justify-center'>
            {page === "login" ? (
                <LoginForm onSuccess={() => { }} onSwitchToSignup={() => { router.push("/auth/signup") }} />
            ) : (
                <SignupForm onSuccess={() => { }} onSwitchToLogin={() => { router.push("/auth/login") }} />
            )}

        </div>
    )
}
