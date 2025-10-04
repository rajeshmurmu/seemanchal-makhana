import { Order } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const Orders = await Order.find()
      .populate("items.productId")
      .populate("user", "name email");

    if (!Orders) {
      return NextResponse.json(
        { success: false, message: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, Orders, message: "Orders fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
