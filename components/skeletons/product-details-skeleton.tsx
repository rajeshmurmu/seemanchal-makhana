import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function ProductDetailsSkeleton() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Image Skeleton */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <Skeleton className="w-full h-96 lg:h-[500px]" />
                            <Skeleton className="absolute top-4 left-4 w-20 h-8 rounded-md" />
                            <Skeleton className="absolute top-4 right-4 w-24 h-8 rounded-md" />
                        </div>
                    </div>

                    {/* Product Details Skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" /> {/* Category */}
                            <Skeleton className="h-8 w-3/4" /> {/* Title */}

                            {/* Rating */}
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-5 w-5 rounded-full" />
                                    ))}
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-8 w-24" /> {/* Price */}
                                <Skeleton className="h-6 w-20" /> {/* Original price */}
                                <Skeleton className="h-6 w-16 rounded-md" /> {/* Discount badge */}
                            </div>
                            <Skeleton className="h-4 w-40" />
                        </div>

                        {/* Description */}
                        <Skeleton className="h-20 w-full" />

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-12 flex-1 rounded-md" />
                            <Skeleton className="h-12 flex-1 rounded-md" />
                            <Skeleton className="h-12 flex-1 rounded-md" />
                        </div>

                        <Separator />

                        {/* Product Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews Section Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" /> {/* Reviews heading */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2 p-4 border rounded-lg">
                            <Skeleton className="h-4 w-32" /> {/* Reviewer */}
                            <Skeleton className="h-4 w-full" /> {/* Review text */}
                            <Skeleton className="h-4 w-2/3" /> {/* Extra line */}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
