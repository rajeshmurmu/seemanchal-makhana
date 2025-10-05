/* eslint-disable @typescript-eslint/no-explicit-any */


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useEffect } from 'react'
import { Star, } from 'lucide-react';
import { ReviewType } from '@/models/review.model';
import ReviewAction from './review-action';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReviewStatus } from '@/lib/client/review-api';
import toast from 'react-hot-toast';


export function StarRating({ rating }: { rating: number }) {

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
        </div>
    );
}

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface ReviewDataTableProps<T> {
    reviews: T[] | ReviewType[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (row: T) => void;
    className?: string;
    testId?: string;
}

export default function ReviewDataTable<T extends Record<string, any>>({ reviews, columns }: ReviewDataTableProps<T>) {

    const queryClient = useQueryClient();
    const { mutate, data, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: updateReviewStatus,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['reviews'] })
        }
    })

    const updateReiviewStatus = (id: string, status: string) => {
        console.log(`Updating review ${id} to status: ${status}`);
        mutate({ reviewId: id, status });

    };

    const statusColors = {
        pending: "secondary",
        approved: "default",
        rejected: "destructive",
        flagged: "destructive",
    } as const;

    useEffect(() => {
        if (data && isSuccess) {
            toast.success(data?.message || 'Review status updated successfully');
        }

        if (isError && error) {
            toast.error(error?.message || 'Failed to update review status');
        }
    }, [data, error, isError, isSuccess]);

    return (
        <Table className='mt-4 w-full'>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column.label} className={column.key as string}>{column.label}</TableHead>
                    ))}
                </TableRow>

            </TableHeader>
            <TableBody>
                {
                    reviews?.map((review) => (
                        <TableRow key={review._id}>
                            <TableCell>
                                {review.product?.name}
                            </TableCell>
                            <TableCell>
                                {review?.user?.name || review?.user?.email || 'Unknown User'}
                            </TableCell>

                            <TableCell>
                                <StarRating rating={review.rating} />
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs">
                                    {review.comment.length > 50 ? review.comment.slice(0, 50) + '...' : review.comment}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusColors[review.status as keyof typeof statusColors]}>
                                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                <ReviewAction updating={isPending} value={review._id} review={review as ReviewType}
                                    updateReviewStatus={updateReiviewStatus}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )
}
