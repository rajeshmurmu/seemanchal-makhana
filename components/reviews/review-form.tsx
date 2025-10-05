"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Star, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "../auth/auth-modal"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postReview } from "@/lib/client/review-api"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { mutate, data, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
    }
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (rating === 0) {
      toast.error("Please select a rating before submitting your review.")
      return
    }

    if (!comment.trim()) {
      toast.error("Please write a comment about the product.")
      return
    }

    // Simulate API call
    mutate({ productId, rating, comment })


  }

  useEffect(() => {

    if (isError && error) {
      toast.error(error.message || "Error while posting your review")
    }

    if (isSuccess || data) {
      toast.success(data?.message || "Review posted successfully.")
      setRating(0)
      setComment("")
    }

  }, [data, error, isError, isSuccess])


  if (!user) {
    return (
      <>
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="font-semibold text-lg">Share Your Experience</h3>
            <p className="text-muted-foreground">Sign in to write a review for this product</p>
            <Button onClick={() => setIsAuthModalOpen(true)}>Sign In to Review</Button>
          </CardContent>
        </Card>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${star <= (hoveredRating || rating) ? "text-secondary fill-current" : "text-muted-foreground"
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                <span>
                  Submitting...
                </span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
