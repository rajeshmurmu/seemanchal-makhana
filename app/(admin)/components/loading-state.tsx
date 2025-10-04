import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingState({ message = "Loading..." }: { message?: string }) {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className="loader flex flex-col items-center justify-center">
                <Loader2 className='animate-spin text-primary' size={50} />
                <p>{message || "Loading in progress"}</p>
            </div>
        </div>
    )
}
