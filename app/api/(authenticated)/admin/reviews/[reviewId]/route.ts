import connectDB from "@/lib/server/mongodb";
import { Review } from "@/models";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const { status } = await request.json();

    await connectDB();
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    review.status = status;
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
