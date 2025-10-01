import { NextRequest } from "next/server";
import connectDB from "@/lib/server/mongodb";
import Category from "@/models/category.model";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().select("name");
    return Response.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return Response.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name.trim()) {
      return Response.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const existingCategory = await Category.findOne({ name: name.trim() });

    if (existingCategory) {
      return Response.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }
    const category = new Category({ name: name.trim() });
    await category.save();
    return Response.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.log("Error creating category:", error);
    return Response.json(
      { success: false, message: "Error creating category" },
      { status: 500 }
    );
  }
}
