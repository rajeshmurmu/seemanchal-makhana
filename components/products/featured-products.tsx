"use client"

import { useQuery } from "@tanstack/react-query"
import { ProductCard } from "./product-card"
import { getAllProducts } from "@/lib/client/product-api"
import { useEffect, useState } from "react"
import { ResponseProductType } from "@/types/types"
import ProductCardSkeleton from "../skeletons/product-card-skeleton"

export function FeaturedProducts() {
    // const featuredProducts = products.filter((product) => product.featured)

    const [featuredProducts, setFeaturedProducts] = useState<ResponseProductType[]>([])
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => getAllProducts({ featured: "true" })
    })


    useEffect(() => {
        if (data) {
            setFeaturedProducts(data.products || [])
        }
    }, [data])

    useEffect(() => {
        if (error || isError) {
            refetch()
            setFeaturedProducts([])
        }
    }, [error, isError, refetch])

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-6xl font-bold text-balance">Featured Products</h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Discover our handpicked selection of premium traditional products, loved by thousands of customers across
                        India.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (

                    <div className="flex flex-wrap justify-center gap-4 mx-auto">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
