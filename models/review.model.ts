import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;

export type Review = mongoose.Document & {
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
};
