// app/api/payment/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/models";
import connectDB from "@/lib/server/mongodb";
import { razorpayInstance } from "@/lib/server/razorpay";
import { CartItem } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", items, clientOrderId } = body;

    if (!amount || !items?.length) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    await connectDB();

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

    // todo validate products, prices, stock, etc.
    // if invalid, cancel the order immediately
    // await razorpayInstance.orders.cancel(rOrder.id);

    // persist order in db
    await Order.create({
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
    });

    return NextResponse.json(
      {
        razorpayOrderId: rOrder.id,
        amount: rOrder.amount,
        currency: rOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("create order error", err);
    return NextResponse.json(
      { error: "server_error", details: JSON.stringify(err) },
      { status: 500 }
    );
  }
}
