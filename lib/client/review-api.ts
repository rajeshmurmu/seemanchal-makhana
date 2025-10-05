import { AxiosError } from "axios";
import apiClient from "./axios-client";

export const fetchAllReviews = async () => {
  try {
    const response = await apiClient.get("/api/admin/reviews");

    if (response.status !== 200 || !response.data.reviews) {
      throw new Error("Failed to fetch reviews");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong while fetching reviews");
  }
};

export const postReview = async ({
  productId,
  rating,
  comment,
}: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const response = await apiClient.post("/api/reviews", {
      productId,
      rating,
      comment,
    });

    if (response.status !== 200 || !response.data.review) {
      throw new Error("Failed to post review");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong while posting the review");
  }
};

export const updateReviewStatus = async ({
  reviewId,
  status,
}: {
  reviewId: string;
  status: string;
}) => {
  try {
    const response = await apiClient.put(`/api/admin/reviews/${reviewId}`, {
      status,
    });

    console.log("Update Review Status Response:", response);
    if (response.status !== 200 || !response.data) {
      throw new Error("Failed to update review status");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong while updating the review status");
  }
};
