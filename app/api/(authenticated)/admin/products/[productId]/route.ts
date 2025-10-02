import {
  deleteAllImageWithFolder,
  uploadImageBufferToCloudinary,
} from "@/lib/server/cloudinary";
import connectDB from "@/lib/server/mongodb";
import { Category } from "@/models";
import Product from "@/models/product.model";
import { productSchema } from "@/shared/schema/product-schema";
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

// update product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const formData = await req.formData();

    const images = formData.getAll("images") as File[];
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const originalPrice = formData.get("originalPrice");
    const category = formData.get("category");
    const inStock = formData.get("inStock");
    const featured = formData.get("featured");

    const validate = productSchema.safeParse({
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice),
      images,
      category,
      featured: Boolean(featured),
      inStock: Boolean(inStock),
    });

    if (!validate.success || validate.error) {
      throw new Error("Invalid product data");
    }

    await connectDB();

    const product = await Product.findById(productId).populate("category");

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const existingCategory = await Category.findOne({
      name: {
        $regex: validate.data.category.trim(),
        $options: "i",
      },
    });

    // filter the type of images File
    const imageFiles = images.filter((image) => image instanceof File);

    // upload image to cloudinary
    const uploadedImages =
      imageFiles &&
      (await uploadImageBufferToCloudinary({
        images: imageFiles,
        product_id: product._id,
      }));

    // update the product
    product.images.push(...uploadedImages);
    product.name = validate.data.name;
    product.description = validate.data.description;
    product.price = Number(validate.data.price);
    product.originalPrice = Number(validate.data.originalPrice);
    product.category = existingCategory ? existingCategory._id : category;
    product.inStock = inStock;
    product.featured = featured;

    await product.save();

    return Response.json(
      {
        success: true,
        product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating product", error);
    return Response.json(
      { success: false, message: "Error updating product" },
      { status: 500 }
    );
  }
}
