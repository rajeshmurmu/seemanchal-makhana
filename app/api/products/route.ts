import connectDB from "@/lib/server/mongodb";
import { Product } from "@/models/index";
import { NextRequest } from "next/server";
const PER_PAGE_LIMIT = 10;

export async function GET(req: NextRequest, {}) {
  try {
    const { searchParams } = new URL(req.nextUrl);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || PER_PAGE_LIMIT;
    const featured = searchParams.get("featured");

    if (isNaN(page) || isNaN(limit)) {
      return Response.json(
        { success: false, message: "Invalid page or limit" },
        { status: 400 }
      );
    }

    if (Number(page) < 1 || Number(limit) < 1) {
      return Response.json(
        { success: false, message: "Invalid page or limit" },
        { status: 400 }
      );
    }

    await connectDB();
    const products = await Product.find({
      ...(featured && { featured: featured === "true" }),
    })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "reviews",
      })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 })
      .lean();

    if (!products) {
      return Response.json(
        { success: false, message: "No products found" },
        { status: 404 }
      );
    }

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    const formattedProducts = products.map((product) => {
      return {
        ...product,
        category: product.category.name,
      };
    });

    return Response.json(
      {
        success: true,
        products: formattedProducts,
        meta: { page, limit, totalPages, totalProducts },
        message: "Products fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching products", error);
    return Response.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}
