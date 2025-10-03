import connectDB from "@/lib/server/mongodb";
import { ProductType } from "@/models/product.model";
import { Product } from "@/models";
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

    const formattedProduct = {
      ...product,
      category: product?.category?.name || null,
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
