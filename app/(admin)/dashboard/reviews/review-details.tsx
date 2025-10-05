import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReviewType } from '@/models/review.model'
import { Eye } from 'lucide-react'
import React from 'react'
import { StarRating } from './review-data-table'

export default function ReviewDetails({ review }: { review: ReviewType }) {
    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-user-details">
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Account Details</h4>
                            <p><strong>User ID: </strong> {review?.user?._id}</p>
                            <p><strong>User Name: </strong> {review.user?.name}</p>
                            <p><strong>Email: </strong> {review?.user?.email}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Review Information</h4>
                            <p><strong>Review ID: </strong>{review._id}</p>
                            <p><strong>Status: </strong>{review.status.toUpperCase()}</p>
                            <div><strong>Rating: </strong>
                                <div className='inline-block'>
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>
                            <p><strong>Comment: </strong>{review.comment}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
