import Link from 'next/link'
import React from 'react'

export default function FestivalBanner() {
    return (
        <>
            {/* Festival Banner */}
            <div className="bg-primary text-primary-foreground py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-4 text-sm font-medium">
                        <span>🎉</span>
                        <span>Festival Special: Get 25% OFF on all traditional products!</span>
                        <Link href="/offers" className="underline hover:no-underline">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
