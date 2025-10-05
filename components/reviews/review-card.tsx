import { Star, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewType } from "@/models/review.model"

interface ReviewCardProps {
  review: ReviewType
}

export function ReviewCard({ review }: ReviewCardProps) {

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt={review.user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {review.user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{review.user?.name}</h4>
                {review.status === "approved" && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toDateString()}</span>
            </div>

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "text-secondary fill-current" : "text-muted-foreground"}`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">({review.rating}/5)</span>
            </div>

            <p className="text-foreground leading-relaxed">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
