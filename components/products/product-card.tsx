"use client"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"
import { toast } from "sonner"
import Image from "next/image"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const handleAddToCart = () => {
        if (!product.inStock) return

        addToCart(product)
        toast.success("Added to cart!", {
            description: `${product.name} has been added to your cart.`,
            className: "bg-primary text-background",
        })
    }

    return (
        <Card className="group gap-2 md:gap-6 hover:shadow-lg transition-all p-0 md:pb-2 duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
                <Link href={`/products/${product.id}`}>
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 md:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                        width={500}
                        height={500}
                    />
                </Link>

                {discountPercentage > 0 && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-background font-bold">
                        {discountPercentage}% OFF
                    </Badge>
                )}

                {!product.inStock && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                        Out of Stock
                    </Badge>
                )}
            </div>

            <CardContent className="px-4">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{product.category}</div>

                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-sm text-nowrap md:text-lg hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    </Link>

                    <p className="hidden text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                    <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-secondary fill-current" : "text-muted-foreground"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full group" disabled={!product.inStock} onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
            </CardFooter>
        </Card>
    )
}
