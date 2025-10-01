"use client"
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function Auth() {

    const { page } = useParams<{ page: "login" | "signup" }>()
    const router = useRouter();

    const handleSuccess = () => { }

    return (
        <div className='min-h-screen flex items-center justify-center'>
            {page === "login" ? (
                <LoginForm onSuccess={handleSuccess} onSwitchToSignup={() => { router.push("/auth/signup") }} />
            ) : (
                <SignupForm onSuccess={handleSuccess} onSwitchToLogin={() => { router.push("/auth/login") }} />
            )}

        </div>
    )
}
