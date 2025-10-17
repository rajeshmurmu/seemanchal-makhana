import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import { Order } from "@/models";
import { CartItem } from "@/types/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "INR",
      items,
      clientOrderId,
      deliveryAddress,
    } = body;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthenticated", message: "Unauthorized, Access Denied" },
        { status: 401 }
      );
    }

    await connectDB();

    const order = new Order({
      user: session.user.id,
      items: items.map((item: CartItem) => ({
        productId: item.product._id as string,
        qty: item.quantity,
        price: item.product.price,
      })),
      amount: amount,
      currency: currency,
      clientOrderId: clientOrderId,
      deliveryAddress,
    });

    await order.save();
    return NextResponse.json(
      { success: true, order, message: "Order created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
