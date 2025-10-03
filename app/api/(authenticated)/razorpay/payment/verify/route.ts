import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/server/mongodb";
import { Order } from "@/models";

function verifySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  hmac.update(orderId + "|" + paymentId);
  const generated_signature = hmac.digest("hex");
  return generated_signature === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      clientOrderId,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const verified = verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    await connectDB();
    const order =
      (await Order.findOne({ razorpayOrderId })) ||
      (clientOrderId && (await Order.findOne({ clientOrderId })));

    if (!order) {
      // optionally create a record — but better to have created order before checkout
      console.warn("Order not found for verification", razorpayOrderId);
    }

    if (!verified) {
      // mark order failed/tampered
      if (order) {
        order.status = "failed";
        await order.save();
      }
      return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
    }

    // If manual capture flow (payment_capture: 0), capture now:
    // await razorpay.payments.capture(razorpayPaymentId, order.amount, order.currency);

    if (order) {
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.status = "paid";
      await order.save();
    }

    // Send confirmation email, update inventory, emit events, etc.
    return NextResponse.json(
      { success: true, message: "Payment verified successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json(
      { error: "server_error", details: JSON.stringify(err) },
      { status: 500 }
    );
  }
}
