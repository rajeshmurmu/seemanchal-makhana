import { Button } from '@/components/ui/button'
import { Award, Check, Flag, Trash2, X } from 'lucide-react'
import React, { useEffect } from 'react'
import ReviewDetails from './review-details'
import { ReviewType } from '@/models/review.model'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview, updateReviewStatus as updateReiviewStatusApi } from '@/lib/client/review-api';
import toast from 'react-hot-toast';

interface IReviewActionProps {
    review: ReviewType,
}


export default function ReviewAction({ review, }: IReviewActionProps) {
    const queryClient = useQueryClient();
    const { mutate: updateStatus, data: updatedData, isPending: updating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useMutation({
        mutationFn: updateReiviewStatusApi,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['reviews'] })
        }
    })

    const updateReviewStatus = ({ id, status, featured }: { id: string, status?: string, featured?: boolean }) => {
        console.log(`Updating review ${id} to status: ${status}`);
        updateStatus({ reviewId: id, status: status && status, featured: featured && featured });

    };

    // handle updating toast
    useEffect(() => {
        if (updatedData && isUpdateSuccess) {
            toast.success(updatedData?.message || 'Review status updated successfully');
        }

        if (isUpdateError && updateError) {
            toast.error(updateError?.message || 'Failed to update review status');
        }

    }, [updatedData, isUpdateSuccess, isUpdateError, updateError]);

    const { mutate: deleteMutate, isSuccess: isDeleteSuccess, data: deletedData, isPending: isDeletePending, isError: isDeleteError, error: DeleteError } = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['reviews'] })
        }
    })

    // handle deleting toast
    useEffect(() => {
        if (deletedData && isDeleteSuccess) {
            toast.success(deletedData?.message || 'Review deleted successfully');
        }

        if (isDeleteError && DeleteError) {
            toast.error(DeleteError?.message || 'Failed to delete review');
        }

    }, [deletedData, isDeleteError, DeleteError, isDeleteSuccess]);

    return (
        <div className="flex items-center gap-1">
            <ReviewDetails review={review} />
            <Button
                variant="destructive"
                disabled={updating || isDeletePending}
                size="sm"
                onClick={() => deleteMutate({ reviewId: review._id })}
                className=""
            >
                <Trash2 className="h-3 w-3" />
            </Button>
            <Button
                variant="outline"
                disabled={updating || isDeletePending}
                size="sm"
                onClick={() => updateReviewStatus({ id: review._id, featured: true })}
                className="text-yellow-500 hover:text-yellow-700"
            >
                <Award className="h-3 w-3" />
            </Button>
            {review.status === "pending" && (
                <>
                    <Button
                        variant="outline"
                        disabled={updating || isDeletePending}
                        size="sm"
                        onClick={() => updateReviewStatus({ id: review._id, status: "approved" })}
                        className="text-green-600 hover:text-green-700"
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        disabled={updating || isDeletePending}
                        size="sm"
                        onClick={() => updateReviewStatus({ id: review._id, status: "rejected" })}
                        className="text-red-600 hover:text-red-700"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        disabled={updating || isDeletePending}
                        size="sm"
                        onClick={() => updateReviewStatus({ id: review._id, status: "flagged" })}
                        className="text-orange-600 hover:text-orange-700"
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
                        disabled={updating || isDeletePending}
                        onClick={() => updateReviewStatus({ id: review._id, status: "rejected" })}
                        className="text-red-600 hover:text-red-700"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={updating || isDeletePending}
                        onClick={() => updateReviewStatus({ id: review._id, status: "flagged" })}
                        className="text-orange-600 hover:text-orange-700"
                    >
                        <Flag className="h-3 w-3" />
                    </Button>
                </>
            )}

            {(review.status === "rejected" || review.status === "flagged") && (
                <Button
                    variant="outline"
                    size="sm"
                    disabled={updating || isDeletePending}
                    onClick={() => updateReviewStatus({ id: review._id, status: "approved" })}
                    className="text-green-600 hover:text-green-700"
                >
                    <Check className="h-3 w-3" />
                </Button>
            )}

        </div>
    )
}
