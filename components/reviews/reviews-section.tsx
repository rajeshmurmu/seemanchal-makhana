"use client"

import { useEffect, useState } from "react"
import { Star, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewCard } from "./review-card"
import { ReviewForm } from "./review-form"
import { ReviewType } from "@/models/review.model"
import { StarRating } from "@/app/(admin)/dashboard/reviews/review-data-table"

interface ReviewsSectionProps {
  productId: string
  averageRating: number
  totalReviews: number
  reviews: ReviewType[]
}

export function ReviewsSection({ productId, averageRating, totalReviews, reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>(reviews)
  const [ratingDistribution, setRatingDistribution] = useState<{ rating: number; count: number; percentage: number }[]>([])


  // Sort reviews
  filteredReviews?.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  useEffect(() => {
    setFilteredReviews(
      reviews?.filter((review) => review.product._id === productId && (filterRating === "all" ? true : review.rating === Number.parseInt(filterRating)))
    )
  }, [filterRating, reviews, productId])

  // Calculate rating distribution
  useEffect(() => {
    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews?.filter((review) => review.rating === rating && review.product._id === productId).length || 0
      const percentage = totalReviews ? (count / totalReviews) * 100 : 0
      return { rating, count, percentage }
    })
    setRatingDistribution(distribution)
  }, [reviews, totalReviews, productId])

  return (
    <section className="space-y-8">
      {/* Reviews Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{averageRating}</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <StarRating rating={averageRating} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Based on {totalReviews} reviews</div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h3 className="font-semibold">Rating Distribution</h3>
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm">{rating}</span>
                <Star className="h-3 w-3 text-secondary fill-current" />
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${percentage as number}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <ReviewForm productId={productId} />

      {/* Filters and Sorting */}
      {reviews?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="font-semibold text-lg">
            {filteredReviews?.length} {filteredReviews?.length === 1 ? "Review" : "Reviews"}
          </h3>

          <div className="flex gap-3">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews?.length > 0 ? (
          filteredReviews?.map((review) => <ReviewCard key={review._id} review={review} />)
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {reviews?.length === 0
                ? "No reviews yet. Be the first to review this product!"
                : "No reviews match your current filters."}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
