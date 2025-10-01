import React from 'react'
import { Skeleton } from '../ui/skeleton'
import ProductCardSkeleton from './product-card-skeleton'

export default function ProductSectionSkeleton() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Heading Skeleton */}
                <div className="text-center space-y-4 mb-12">
                    <Skeleton className="h-10 w-3/4 mx-auto lg:w-1/2" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                </div>

                {/* Products Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>

                {/* View All Products Button Skeleton */}
                <div className="flex justify-center mt-8">
                    <Skeleton className="h-10 w-48 rounded-md" />
                </div>
            </div>
        </section>
    )
}
