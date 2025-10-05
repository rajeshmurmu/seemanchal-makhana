import connectDB from "@/lib/server/mongodb";
import { Review } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("product", "name slug");

    if (!reviews) {
      return NextResponse.json(
        { success: false, message: "No reviews found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, reviews, message: "Reviews fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
