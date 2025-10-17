"use client"

import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { cartIsOpen, setCartIsOpen, items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart()


  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()


  return (
    <Sheet open={cartIsOpen} onOpenChange={setCartIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full flex flex-col p-0 sm:max-w-lg">
        <SheetHeader className="px-4 py-2">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({totalItems} items)
          </SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some products to get started</p>
                </div>
                <Button onClick={() => setCartIsOpen(false)}>Continue Shopping</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-2 pb-72">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.product.images && item.product.images[0] as string || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                        width={500}
                        height={500}
                      />

                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        <p className="font-semibold text-primary">₹{item.product.price}</p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-4 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">₹{totalPrice}</p>
                  </div>
                </div>

                <Separator />

                <SheetFooter>
                  <Link href="/checkout" className="w-full" >
                    <Button onClick={() => setCartIsOpen(false)} className="w-full">
                      Checkout Now
                    </Button>
                  </Link>
                </SheetFooter>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
