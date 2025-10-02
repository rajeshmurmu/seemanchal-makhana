"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { ProductCard } from "./product-card"
import { useQuery } from "@tanstack/react-query"
import { getAllProducts } from "@/lib/client/product-api"
import { useEffect, useState } from "react"
import { ResponseProductType } from "@/types/types"
import ProductCardSkeleton from "../skeletons/product-card-skeleton"

export function Products() {
  const [products, setProducts] = useState<ResponseProductType[]>([])
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['home-products'],
    queryFn: () => getAllProducts({})
  })

  useEffect(() => {
    if (data) {
      setProducts(data.products || [])
    }
  }, [data])

  useEffect(() => {
    if (error || isError) {
      refetch()
      setProducts([])

    }
  }, [error, isError, refetch])




  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-6xl font-bold text-balance">Our Products</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Discover our handpicked selection of premium makhana products, loved by thousands of customers across India.
          </p>
        </div>

        {isLoading && (
          //Products Grid Skeleton 
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4 mx-auto">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div>
          <Link href="/products">
            <Button className="mt-8 cursor-pointer">View All Products</Button>
          </Link>
        </div>
      </div>
    </section >
  )
}
