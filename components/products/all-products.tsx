"use client"
import { useQuery } from "@tanstack/react-query"
import { ProductCard } from "./product-card"
import { getAllProducts } from "@/lib/client/product-api"
import { useEffect, useState } from "react"
import { ResponseProductType } from "@/types/types"
import ProductCardSkeleton from "../skeletons/product-card-skeleton"



export function AllProducts() {

    const { data, isLoading, error, } = useQuery({
        queryKey: ['all-products'],
        queryFn: () => getAllProducts({})
    })

    const [products, setProducts] = useState<ResponseProductType[]>([])


    useEffect(() => {
        setProducts(data?.products || [])
    }, [data])

    if (error) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl lg:text-6xl font-bold text-balance">
                            {error.message || " Something went wrong while fetching products"}
                        </h2>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-6xl font-bold text-balance">Expore Our Products</h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Discover our handpicked selection of premium traditional products, loved by thousands of customers across
                        India.
                    </p>
                </div>


                {
                    isLoading ? (

                        <>
                            {/* Products Grid Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </>

                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                            {products?.map((product: ResponseProductType) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )
                }

            </div>
        </section>
    )
}
