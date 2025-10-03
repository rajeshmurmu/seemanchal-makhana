/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CartItem } from '@/types/types';
import React from 'react'
import { Button } from '../ui/button';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/client/order-api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

type Props = {
  items?: CartItem[];
  singleItem?: CartItem;
  amount: number; // paise
  buttonText?: string;
};

export default function CheckoutButton({ items, singleItem, amount, buttonText = "Checkout" }: Props) {
  const { user } = useAuth()
  const router = useRouter();
  const clientOrderId = "order_" + crypto.randomUUID().slice(0, 28);

  // console.log("CheckoutButton", { items, singleItem, clientOrderId, amount });
  const createOrder = async () => {
    // initialize razorpay order on server
    const data = await createRazorpayOrder({ amount, items: items ? items : [singleItem] as CartItem[], clientOrderId });

    // inject razorpay script if not present
    if (!(window).Razorpay) {
      await new Promise<void>((resolve) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Seemanchal Makhana",
      description: "Order Payment Transaction",
      order_id: data.razorpayOrderId,
      handler: async function (response: any) {
        // Send to server to verify and finalize
        const data = await verifyRazorpayPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          clientOrderId,
        });

        if (!data.success) {
          toast.error("Payment verification failed. Please contact support.");
          return;
        }
        // handle success UI, redirect to order page, etc.
        // window.location.href = `/order-success?orderId=${data.razorpayOrderId}`;

        router.push(`/order-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&verification_status=${data.message}`);
        toast.success("Payment successful! Order is being processed.");
      },

      prefill: {
        email: user?.email,
        contact: "",
      },
      theme: {
        color: "#8d1900",
      },
    };
    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.success", function (resp: any) {
      console.log("payment.success", resp);
      router.push(`/order-success?payment_id=${resp.razorpay_payment_id}&order_id=${resp.razorpay_order_id}`);
    });

    rzp.on("payment.failed", function (resp: any) {
      console.error("payment.failed", resp);
      toast.error(resp.error.description || "Payment failed. Please try again");
    });
    rzp.open();
  };





  return (
    <>
      <Button
        variant={"default"}
        size={"lg"}
        onClick={createOrder}
      >
        {buttonText} ₹ {(amount / 100).toFixed(2)}
      </Button>
    </>
  )
}
