import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function ProductCardSkeleton() {
    return (
        <Card className="group gap-2 md:gap-6 p-0 md:pb-2 overflow-hidden animate-pulse">
            <div className="relative overflow-hidden">
                {/* Image Skeleton */}
                <Skeleton className="w-full h-48 md:h-72" />

                {/* Discount Badge Skeleton */}
                <Skeleton className="absolute top-2 left-2 w-16 h-6 rounded-md" />

                {/* Out of Stock Badge Skeleton */}
                <Skeleton className="absolute top-2 right-2 w-20 h-6 rounded-md" />
            </div>

            <CardContent className="px-4">
                <div className="space-y-2">
                    {/* Category Skeleton */}
                    <Skeleton className="w-1/3 h-4" />

                    {/* Product Name Skeleton */}
                    <Skeleton className="w-2/3 h-6" />

                    {/* Description Skeleton */}
                    <Skeleton className="w-full h-4" />

                    {/* Rating Skeleton */}
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-4 rounded-full" />
                        ))}
                        <Skeleton className="w-6 h-4 ml-2" />
                    </div>

                    {/* Price Skeleton */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-12 h-6" />
                        <Skeleton className="w-8 h-4" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                {/* Add to Cart Skeleton */}
                <Skeleton className="w-full h-10 rounded-md" />
            </CardFooter>
        </Card>

    )
}
