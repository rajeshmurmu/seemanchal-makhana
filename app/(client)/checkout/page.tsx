"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import CheckoutButton from "@/components/razorpay/checkout-button"
import { CartItem } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { getProductWithSlug } from "@/lib/client/product-api"
import LoadingState from "@/app/(admin)/components/loading-state"
import { useOrderMutation } from "@/hooks/use-order-mutation"
import { useAuth } from "@/lib/auth-context"

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { codOrderMutation, isCODOrderSuccess } = useOrderMutation()
  const { items, getTotalPrice, clearCart } = useCart()
  const { addressData } = useAddressData()
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [products, setProducts] = useState<CartItem[]>([])



  // selected address id (default to default address if available)
  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isDefault)?._id as string ?? addresses[0]?._id as string ?? null,
    [addresses],
  )
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddressId)
  const [payment, setPayment] = useState<"cod" | "upi" | "card">("cod")

  const product = searchParams.get('product')
  const quantity = searchParams.get('quantity')
  const productId = searchParams.get('productId')

  // get params product only when product slug is available
  const { data, isLoading } = useQuery({
    queryKey: ['product', product],
    queryFn: () => getProductWithSlug({ slug: product as string }),
    enabled: !!product // only run query when product slug exists
  })


  useEffect(() => {
    if (addressData) {
      setAddresses(addressData as AddressType[])
    }
  }, [addressData])

  useEffect(() => {
    if (data?.product) {
      // fetch product details and add to products array
      setProducts([{ product: data?.product, quantity: Number(quantity) }])
    } else {
      setProducts(items)
    }
  }, [data, items, product, productId, quantity])




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



  const totalPrice = productId ? Number(quantity) * data?.product?.price : getTotalPrice();
  const subtotal = totalPrice
  const shipping = subtotal > 999 ? 0 : 49
  const total = subtotal + shipping
  const clientOrderId = "order_" + crypto.randomUUID().slice(0, 28);

  const handlePlaceOrder = () => {
    if (!products.length) {
      toast.error("Please add items to cart before placing an order.")
      router.push("/products")
      return
    }
    if (!selectedAddressId) {
      toast.error("Please add or select a shipping address to continue.")
      return
    }
    // Simulate order success
    codOrderMutation({
      items: products,
      amount: total,
      clientOrderId,
      deliveryAddress: selectedAddressId
    })
  }

  useEffect(() => {
    if (products.length > 1 && isCODOrderSuccess) {
      clearCart()
    }
  }, [clearCart, isCODOrderSuccess, products.length])

  useEffect(() => {
    if (!user?.email || !user?.id) {
      router.push('/auth/login?callbackUrl=/checkout')
      return
    }
  }, [router, user?.email, user?.id])

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <LoadingState message="Please wait..." />

    </div>
  )

  if (!products.length && !isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">No items to checkout.</h2>
      </div>
    )
  }

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
                  <Label htmlFor="pay-upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="pay-card" value="card" />
                  <Label htmlFor="pay-card">Credit/Debit Card</Label>
                </div>
              </RadioGroup>

              <Separator />

              {
                payment === "cod" ? (
                  <Button className="w-full" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                ) : (
                  <CheckoutButton items={products} buttonText="Proceed to Checkout" amount={Number(total) * 100} deliveryAddress={selectedAddressId!} />
                )
              }
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <OrderSummary items={products} total={total} shipping={shipping} subtotal={subtotal} />
        </div>
      </div>
    </main>
  )
}


