import { Button } from '@/components/ui/button'
import { Check, Flag, X } from 'lucide-react'
import React from 'react'
import ReviewDetails from './review-details'
import { ReviewType } from '@/models/review.model'

interface IReviewActionProps {
    review: ReviewType,
    updateReviewStatus: (id: string, status: string) => void,
    value?: string
    updating?: boolean

}


export default function ReviewAction({ review, updateReviewStatus, value, updating }: IReviewActionProps) {
    return (
        <div className="flex items-center gap-1">
            <ReviewDetails review={review} />
            {review.status === "pending" && (
                <>
                    <Button
                        variant="outline"
                        disabled={updating}
                        size="sm"
                        onClick={() => updateReviewStatus(review._id, "approved")}
                        className="text-green-600 hover:text-green-700"
                        data-testid={`button-approve-review-${value}`}
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        disabled={updating}
                        size="sm"
                        onClick={() => updateReviewStatus(review._id, "rejected")}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-reject-review-${value}`}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        disabled={updating}
                        size="sm"
                        onClick={() => updateReviewStatus(review._id, "flagged")}
                        className="text-orange-600 hover:text-orange-700"
                        data-testid={`button-flag-review-${value}`}
                    >
                        <Flag className="h-3 w-3" />
                    </Button>
                </>
            )}

            {review.status === "approved" && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={updating}
                        onClick={() => updateReviewStatus(review._id, "rejected")}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-reject-approved-review-${value}`}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={updating}
                        onClick={() => updateReviewStatus(review._id, "flagged")}
                        className="text-orange-600 hover:text-orange-700"
                        data-testid={`button-flag-approved-review-${value}`}
                    >
                        <Flag className="h-3 w-3" />
                    </Button>
                </>
            )}

            {(review.status === "rejected" || review.status === "flagged") && (
                <Button
                    variant="outline"
                    size="sm"
                    disabled={updating}
                    onClick={() => updateReviewStatus(review._id, "approved")}
                    className="text-green-600 hover:text-green-700"
                    data-testid={`button-approve-flagged-review-${value}`}
                >
                    <Check className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
}
