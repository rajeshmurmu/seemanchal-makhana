"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewType } from "@/models/review.model";
import ReviewDataTable from "./review-data-table";
import { useQuery } from "@tanstack/react-query";
import { fetchAllReviews } from "@/lib/client/review-api";
import LoadingState from "../../components/loading-state";

export default function ReviewModeration() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['reviews'],
        queryFn: fetchAllReviews,
    });

    useEffect(() => {
        if (data) {
            setReviews(data?.reviews || []);
        }
    }, [data]);

    // handle review fetch error
    useEffect(() => {
        if (isError && error) {
            console.error(error.message || "Failed to fetch reviews");
        }
    }, [isError, error]);


    const columns = [
        {
            key: "productName" as keyof ReviewType,
            label: "Product"
        },
        {
            key: "customerName" as keyof ReviewType,
            label: "Customer"
        },
        {
            key: "rating" as keyof ReviewType,
            label: "Rating",
        },
        {
            key: "comment" as keyof ReviewType,
            label: "Comment",
        },
        {
            key: "status" as keyof ReviewType,
            label: "Status",
        },
        {
            key: "date" as keyof ReviewType,
            label: "Date"
        },
        {
            key: "id" as keyof ReviewType,
            label: "Actions",
        }
    ];

    // Summary statistics
    const reviewStats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === "pending").length,
        approved: reviews.filter(r => r.status === "approved").length,
        flagged: reviews.filter(r => r.status === "flagged").length,
        avgRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    };

    if (isLoading) {
        return (
            <LoadingState message="Please wait while we fetch the reviews" />
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{reviewStats.total}</div>
                        <p className="text-xs text-muted-foreground">Total Reviews</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{reviewStats.pending}</div>
                        <p className="text-xs text-muted-foreground">Pending Review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{reviewStats.flagged}</div>
                        <p className="text-xs text-muted-foreground">Flagged</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{reviewStats.avgRating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </CardContent>
                </Card>
            </div>

            <Card data-testid="card-review-moderation">
                <CardHeader>
                    <CardTitle>Review Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReviewDataTable
                        reviews={reviews}
                        columns={columns}
                        searchPlaceholder="Search reviews..."
                        testId="reviews-table"
                    />
                </CardContent>
            </Card>
        </div>
    );
}