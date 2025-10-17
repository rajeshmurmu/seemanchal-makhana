"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { AddressSelector } from "@/components/checkout/address-selector"
import { OrderSummary } from "@/components/checkout/order-summary"
import { useAddressData } from "@/hooks/use-address-data"
import { AddressType } from "@/models/address.model"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { addressData } = useAddressData()
  const [addresses, setAddresses] = useState<AddressType[]>([])



  useEffect(() => {
    if (addressData) {
      setAddresses(addressData as AddressType[])
    }
  }, [addressData])

  // selected address id (default to default address if available)
  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isDefault)?._id as string ?? addresses[0]?._id as string ?? null,
    [addresses],
  )
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddressId)
  const [payment, setPayment] = useState<"cod" | "upi" | "card">("cod")

  useEffect(() => {
    // keep selected id consistent with any address changes
    if (!addresses.length) {
      setSelectedAddressId(null)
    } else if (!selectedAddressId) {
      setSelectedAddressId(defaultAddressId)
    } else if (!addresses.find((a) => a._id === selectedAddressId)) {
      setSelectedAddressId(defaultAddressId)
    }
  }, [addresses, selectedAddressId, defaultAddressId])

  const handlePlaceOrder = () => {
    if (!items.length) {
      toast.error("Please add items to cart before placing an order.")
      router.push("/")
      return
    }
    if (!selectedAddressId) {
      toast.error("Please add or select a shipping address to continue.")
      return
    }
    // Simulate order success
    clearCart()
    toast.success(`Payment method: ${payment.toUpperCase()}. You'll receive a confirmation shortly.`)
    router.push("/")
  }

  useEffect(() => {
    if (!items.length) {
      router.push("/")
    }
  }, [items, router])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-balance mb-6">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AddressSelector selectedId={selectedAddressId} onChange={setSelectedAddressId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={payment}
                onValueChange={(v: "cod" | "upi" | "card") => setPayment(v)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="pay-cod" value="cod" />
                  <Label htmlFor="pay-cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="pay-upi" value="upi" />
                  <Label htmlFor="pay-upi">UPI (simulate)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="pay-card" value="card" />
                  <Label htmlFor="pay-card">Credit/Debit Card (simulate)</Label>
                </div>
              </RadioGroup>

              <Separator />
              <Button className="w-full" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <OrderSummary />
        </div>
      </div>
    </main>
  )
}


