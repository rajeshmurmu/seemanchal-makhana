import { NextRequest, NextResponse } from "next/server";
import { Address, Order, Product, User } from "@/models";
import connectDB from "@/lib/server/mongodb";
import { razorpayInstance } from "@/lib/server/razorpay";
import { CartItem } from "@/types/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server/auth";
import { sendOrderConfirmationEmail } from "@/lib/server/nodemailer";

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

    if (!amount || !items?.length) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    await connectDB();
    // find the user in db
    const user = await User.findById(session?.user?.id);

    if (!user) {
      return NextResponse.json(
        { error: "unauthenticated", message: "Unauthorized, Access Denied" },
        { status: 401 },
      );
    }

    // todo validate products, prices, stock, etc.
    const products = await Product.find({
      _id: { $in: items.map((i: CartItem) => i.product._id) },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "invalid_products", message: "Invalid products" },
        { status: 400 },
      );
    }

    // if invalid, cancel the order immediately
    // Idempotency: if clientOrderId provided, return existing
    if (clientOrderId) {
      const existing = await Order.findOne({ clientOrderId });
      if (existing) {
        return NextResponse.json({
          razorpayOrderId: existing.razorpayOrderId,
          amount: existing.amount,
          currency: existing.currency,
        });
      }
    }

    // Razorpay expects amount in smallest unit (paise). Pass integer.
    const options = {
      amount: amount, // e.g., 50000 for ₹500.00 (not decimal)
      currency,
      receipt: clientOrderId || `rcpt_${crypto.randomUUID().slice(0, 28)}`,
      payment_capture: 1, // 1 = auto-capture, 0 = manual capture
      notes: {
        integration: "seemanchal-makhana",
      },
    };

    const rOrder = await razorpayInstance.orders.create(options);

    // persist order in db
    const order = await Order.create({
      clientOrderId,
      razorpayOrderId: rOrder.id,
      amount: rOrder.amount,
      currency: rOrder.currency,
      items: items.map((item: CartItem) => ({
        productId: item.product._id as string,
        qty: item.quantity,
        price: item.product.price,
      })),
      status: "created",
      paymentMethod: "razorpay",
      user: user?._id,
      deliveryAddress: deliveryAddress,
    });

    // link order to user
    user.orders.push(order._id);
    await user.save();

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
        totalAmount: order.amount / 100,
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
      {
        razorpayOrderId: rOrder.id,
        amount: rOrder.amount,
        currency: rOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        message: "Order created successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("create order error", err);
    return NextResponse.json(
      { error: "server_error", details: JSON.stringify(err) },
      { status: 500 },
    );
  }
}
