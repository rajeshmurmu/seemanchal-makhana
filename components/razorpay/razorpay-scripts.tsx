/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Script from "next/script";
// Extend the Window interface to include Razorpay
declare global {
    interface Window {
        Razorpay?: any;
    }
}

export default function RazorpayScript() {

    return (
        <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
            onLoad={() => console.log("Razorpay SDK loaded successfully")}
            onError={(e) => console.error("Failed to load Razorpay SDK", e)}
            strategy="afterInteractive" // Load after the page is interactive
        />
    );
}