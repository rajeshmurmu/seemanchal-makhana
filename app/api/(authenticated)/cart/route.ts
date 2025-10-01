import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import Cart from "@/models/cart.model";
import { ProductType } from "@/models/product.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

type CartItem = {
  product: Omit<ProductType, "category"> & { _id: string };
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { productId, quantity } = await req.json();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    let cart;
    cart = await Cart.findOne({ user: session?.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = new Cart({ user: session?.user.id });
      cart.items.push({ product: productId, quantity });

      await cart.save();

      return Response.json({ success: true, cart }, { status: 200 });
    }

    const existingItem = cart.items.find(
      (item: CartItem) => item.product._id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return Response.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.log("Error fetching products:", error);
    return Response.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}
