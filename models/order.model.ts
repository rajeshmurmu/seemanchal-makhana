import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientOrderId: { type: String, index: true }, // optional client-provided id to ensure idempotency
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "cod" },
    amount: { type: Number, required: true }, // in paise (INR*100)
    currency: { type: String, default: "INR" },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
        "refund_pending",
        "refunded",
        "cancelled",
      ],
      default: "created",
    },
    orderStatus: {
      type: String,
      enum: [
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "delayed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refund_initiated",
        "refund_completed",
      ],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;

export type OrderType = mongoose.InferSchemaType<typeof OrderSchema> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
