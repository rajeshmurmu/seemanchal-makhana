"use client"

import { useQuery } from "@tanstack/react-query"
import { ReviewCard } from "./reviews/review-card"
import { getFeaturedReviews } from "@/lib/client/review-api"
import { ReviewType } from "@/models/review.model"
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import AutoScroll from "embla-carousel-auto-scroll"

export function CustomerReviewsSection() {

    const { data } = useQuery({
        queryKey: ['customer-reviews'],
        queryFn: getFeaturedReviews
    })

    const featuredReviews = data?.reviews || []

    if (!featuredReviews.length) {
        return null
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-balance">What Our Customers Say</h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Read authentic reviews from our satisfied customers who trust ShuddhSwad for their traditional food needs.
                    </p>
                </div>

                <Carousel
                    opts={{
                        loop: true,
                    }}

                    plugins={[
                        AutoScroll({ stopOnInteraction: false, direction: "forward", startDelay: 1000, stopOnMouseEnter: false, stopOnFocusIn: false }),
                    ]}
                >
                    <CarouselContent>
                        {featuredReviews.map((review: ReviewType) => (
                            <CarouselItem key={review._id} className='lg:basis-1/2 min-h-[218px]' >
                                <ReviewCard review={review} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>


                <div className="text-center mt-8">
                    <p className="text-muted-foreground">
                        Join thousands of happy customers who trust ShuddhSwad for authentic traditional foods.
                    </p>
                </div>
            </div>
        </section>
    )
}
