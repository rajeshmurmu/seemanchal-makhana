import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import { sendOrderConfirmationEmail } from "@/lib/server/nodemailer";
import { Address, Order } from "@/models";
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
        { status: 401 },
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

    const address = await Address.findById(order.deliveryAddress);

    // send email notification to user about order creation this can be moved to a background job or webhook handler
    await sendOrderConfirmationEmail({
      toEmail: session.user.email as string,
      orderDetails: {
        customerName: session.user.name || "Valued Customer",
        orderID: order._id.toString(),
        orderDate: order.createdAt.toISOString(),
        items: items.map((item: CartItem) => ({
          name: item?.product?.name,
          quantity: item?.quantity,
          price: item?.product?.price,
        })),
        totalAmount: order.amount,
        shippingAddress: address
          ? {
              street: address?.line1 || address?.line2 || "",
              city: address.city || "",
              state: address.state || "",
              country: address.country || "",
              zip: address.postalCode || "",
            }
          : { street: "", city: "", zip: "" },
        deliveryDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // Estimated delivery date: 7 days from now,
      },
    });

    return NextResponse.json(
      { success: true, order, message: "Order created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
