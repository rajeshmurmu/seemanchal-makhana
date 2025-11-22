import connectDB from "@/lib/server/mongodb";
import { Product, Review } from "@/models";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const { status, featured } = await request.json();

    await connectDB();
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    if (status) review.status = status;

    if (featured) review.featured = featured;
    await review.save();

    return NextResponse.json(
      {
        success: true,
        review,
        message: "Review status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;

    await connectDB();
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    await Product.findOneAndUpdate(
      { _id: deletedReview.product },
      { $pull: { reviews: deletedReview._id } }
    );

    return NextResponse.json(
      { success: true, deletedReview, message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
