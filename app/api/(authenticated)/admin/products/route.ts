import { NextRequest } from "next/server";
import connectDB from "@/lib/server/mongodb";
import { Category, Product } from "@/models";
import { productSchema } from "../../../../../shared/schema/product-schema";
import { ZodError } from "zod";
import { generateProductSlug } from "./helper";
import { uploadImageBufferToCloudinary } from "@/lib/server/cloudinary";

export async function POST(req: NextRequest) {
  try {
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

    // console.log({ validatedData: validate.data, formData });

    if (!validate.success || validate.error) {
      return Response.json(
        { success: false, message: validate.error.message },
        { status: 400 }
      );
    }

    await connectDB();
    const existingProduct = await Product.findOne({ name: validate.data.name });
    if (existingProduct) {
      return Response.json(
        { success: false, message: "Product already exists" },
        { status: 400 }
      );
    }

    let categoryDoc = await Category.findOne({
      name: validate.data.category.trim(),
    });

    if (!categoryDoc) {
      categoryDoc = new Category({ name: validate.data.category.trim() });
    }

    const product = new Product({
      name: validate.data.name,
      slug: generateProductSlug(validate.data.name),
      description: validate.data.description,
      originalPrice: validate.data.originalPrice,
      price: validate.data.price,
      category: categoryDoc._id,
      inStock: validate.data.inStock,
      featured: validate.data.featured,
    });

    // upload image to cloudinary
    const uploadedImages = await uploadImageBufferToCloudinary({
      images,
      product_id: product._id,
    });

    product.images = uploadedImages;
    categoryDoc.products.push(product._id);

    await categoryDoc.save();
    await product.save();
    return Response.json(
      { success: true, product, message: "Product added successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    console.log("Error creating product", error);
    return Response.json(
      { success: false, message: "Error creating product" },
      { status: 500 }
    );
  }
}
