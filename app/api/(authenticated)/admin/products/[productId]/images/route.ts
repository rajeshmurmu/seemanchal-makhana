import { deleteImageFromCloudinary } from "@/lib/server/cloudinary";
import { Product } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(req.nextUrl);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl || !productId)
      return NextResponse.json(
        { success: false, message: "Image id or product id not found" },
        { status: 400 }
      );

    await deleteImageFromCloudinary({ productId, imageUrl });
    await Product.updateOne(
      { _id: productId },
      { $pull: { images: imageUrl } }
    );

    return NextResponse.json(
      { success: true, message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
