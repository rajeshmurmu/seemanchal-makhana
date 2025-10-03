import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guestCartId: {
      type: String,
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema, "carts");

export default Cart;

export type Cart = mongoose.InferSchemaType<typeof cartSchema>;
