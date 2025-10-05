import connectDB from "@/lib/server/mongodb";
import { ProductType } from "@/models/product.model";
import { Product, Review } from "@/models";
import { NextRequest } from "next/server";

type PopulatedProduct = Omit<ProductType, "category"> & {
  category: {
    name: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product: PopulatedProduct & any = await Product.findOne({ slug })
      .populate<PopulatedProduct>({ path: "category", select: "name -_id" })
      .lean();

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const reviews = await Review.find({
      product: product._id,
      status: "approved",
    })
      .populate("user", "name email")
      .populate("product", "name slug")
      .lean();

    const formattedProduct = {
      ...product,
      category: product?.category?.name || null,
      reviews: reviews || [],
    };
    // console.log({ formattedProduct });

    return Response.json(
      { success: true, product: formattedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching product:", error);
    return Response.json(
      { success: false, message: "Error fetching product" },
      { status: 500 }
    );
  }
}
