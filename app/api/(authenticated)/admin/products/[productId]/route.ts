import { deleteAllImageWithFolder } from "@/lib/server/cloudinary";
import connectDB from "@/lib/server/mongodb";
import { Category } from "@/models";
import Product from "@/models/product.model";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // delete images from cloudinary
    await deleteAllImageWithFolder({
      product_id: deletedProduct._id.toString(),
    });

    const removeFromCategory = await Category.updateOne(
      { _id: deletedProduct.category },
      { $pull: { products: deletedProduct._id } }
    );

    if (!removeFromCategory) {
      return Response.json(
        { success: false, message: "Error removing product from category" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        data: deletedProduct,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting product:", error);
    return Response.json(
      { success: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
