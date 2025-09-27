"use client"

import { ProductCard } from "./product-card"
import { products } from "@/lib/data"

export function FeaturedProducts() {
    const featuredProducts = products.filter((product) => product.featured)

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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
