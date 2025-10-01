"use client"
import { useParams } from "next/navigation"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReviewsSection } from "@/components/reviews/reviews-section"

import { ResponseProductType } from "@/types/types"
import Image from "next/image"
import toast from "react-hot-toast"
import { useCart } from "@/lib/cart-context"
import { useQuery } from "@tanstack/react-query"
import { getProductWithSlug } from "@/lib/client/product-api"
import { useEffect, useState } from "react"
import ProductDetailsSkeleton from "@/components/skeletons/product-details-skeleton"

export default function ProductPage() {
    const params = useParams<{ slug: string }>()
    const { addToCart } = useCart()

    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['product', params.slug],
        queryFn: () => getProductWithSlug({ slug: params.slug })
    })
    const [product, setProduct] = useState<ResponseProductType | null>(null)

    useEffect(() => {
        if (data) {
            setProduct(data.product)
        }
    }, [data])

    useEffect(() => {
        if (error || isError) {
            refetch()
            setProduct(null)
        }
    }, [error, isError, refetch])

    const handleAddToCart = () => {
        if (!product?.inStock) return

        addToCart(product)
        toast.success(`${product.name} has been added to your cart.`)
    }

    const discountPercentage = product?.originalPrice
        ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
        : 0


    if (isLoading) {
        return (
            <ProductDetailsSkeleton />
        )
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={product?.images && product?.images[0] as string || "/placeholder.svg"}
                                alt={product?.name as string || "Product Image"}
                                className="w-full h-96 lg:h-[500px] object-cover"
                                width={500}
                                height={500}
                            />
                            {discountPercentage > 0 && (
                                <Badge className="absolute top-4 left-4 bg-destructive text-background font-bold">
                                    {discountPercentage}% OFF
                                </Badge>
                            )}
                            {!product?.inStock && (
                                <Badge variant="secondary" className="absolute top-4 right-4">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">{product?.category}</div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-balance">{product?.name}</h1>

                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product?.rating as number) ? "text-secondary fill-current" : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {product?.rating} ({product?.reviewCount} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-primary">₹{product?.price}</span>
                                {product?.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">₹{product?.originalPrice}</span>
                                )}
                                {discountPercentage > 0 && <Badge variant="destructive">Save {discountPercentage}%</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">{product?.description}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={handleAddToCart} size="lg" className="flex-1 py-2 group" disabled={!product?.inStock}>
                                <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                {product?.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                            <Button variant="outline" size="lg">
                                <Heart className="mr-2 h-4 w-4" />
                                Wishlist
                            </Button>
                            <Button variant="outline" size="lg">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>

                        <Separator />

                        {/* Product Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                <Truck className="h-5 w-5 text-primary" />
                                <div>
                                    <div className="font-medium text-sm">Free Delivery</div>
                                    <div className="text-xs text-muted-foreground">On orders above ₹500</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                <Shield className="h-5 w-5 text-primary" />
                                <div>
                                    <div className="font-medium text-sm">Quality Assured</div>
                                    <div className="text-xs text-muted-foreground">100% authentic products</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                <RotateCcw className="h-5 w-5 text-primary" />
                                <div>
                                    <div className="font-medium text-sm">Easy Returns</div>
                                    <div className="text-xs text-muted-foreground">7-day return policy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsSection productId={product?._id as string} averageRating={product?.rating as number} totalReviews={product?.reviewCount as number} />
            </main>
        </div>
    )
}
