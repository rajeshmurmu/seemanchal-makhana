import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import { Product } from "@/models";
import Review from "@/models/review.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const newReview = new Review({
      product: productId,
      user: session.user.id,
      rating,
      comment,
      status: "pending",
    });

    const savedReview = await newReview.save();

    if (!savedReview) {
      return NextResponse.json(
        { success: false, message: "Failed to save review" },
        { status: 500 }
      );
    }

    await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { reviews: savedReview._id } }
    );

    return NextResponse.json(
      { success: true, review: savedReview },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error posting reviews:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // get search params
    const { searchParams } = new URL(req.nextUrl);
    const featured = searchParams.get("featured");
    await connectDB();
    const reviews = await Review.find({
      ...(featured && { featured: featured === "true" }),
    })
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
