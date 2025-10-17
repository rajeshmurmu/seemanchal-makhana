"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/types/types"



export function OrderSummary({ total, items, shipping, subtotal }: { total: number, items: CartItem[], shipping: number, subtotal: number }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                        <div key={product._id} className="flex items-center gap-3">
                            <Image
                                src={product?.images[0] || "/placeholder.svg?height=64&width=64&query=product image"}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                            </div>
                            <div className="text-sm font-semibold">₹{product.price * quantity}</div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">₹{total}</span>
            </CardFooter>
        </Card>
    )
}
