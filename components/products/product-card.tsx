"use client"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import toast from "react-hot-toast"
import Image from "next/image"
import { ResponseProductType } from "@/types/types"
import { StarRating } from "@/app/(admin)/dashboard/reviews/review-data-table"
import { ReviewType } from "@/models/review.model"



interface ProductCardProps {
    product: ResponseProductType,
    reviews?: ReviewType[]
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const handleAddToCart = () => {
        if (!product.inStock) return

        addToCart(product)
        toast.success(`${product.name} has been added to your cart.`)
    }
    return (
        <Card className="group w-[45%] lg:w-xs gap-2 md:gap-6 hover:shadow-lg transition-all p-0 md:pb-2 duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                    <Image
                        src={product.images && product.images[0] as string || "/placeholder.jpg"}
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

                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-sm text-nowrap md:text-lg hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    </Link>

                    <p className="hidden text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                    <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                            {/* {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-secondary fill-current" : "text-muted-foreground"
                                        }`}
                                />
                            ))} */}

                            <StarRating rating={(product.reviews && product.reviews?.reduce((acc, review) => acc + review.rating, 0) / product.reviews?.length) || 0} />
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
