"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';

export default function OrderSuccess() {

    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const verificationStatus = searchParams.get('verification_status');

    return (
        <div className="container mx-auto p-4 text-center">
            <div className="flex flex-col items-center mb-6">
                <BadgeCheck className="inline-block size-12 mr-2 text-green-600" />
                <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
            </div>
            <p className="text-lg">Thank you for your purchase.</p>
            {paymentId && <p>Razorpay Payment ID: {paymentId}</p>}
            {orderId && <p>Your Order ID: {orderId}</p>}
            <p className="mt-4 text-gray-700">{verificationStatus}</p>
            <p className="mt-8">We have received your payment and your order is being processed.</p>
            <p>A confirmation email will be sent to you shortly.</p>
            <p className="mt-4">
                <Link href="/" className="text-blue-600 hover:underline">
                    Continue Shopping
                </Link>
            </p>
        </div>
    );
}
