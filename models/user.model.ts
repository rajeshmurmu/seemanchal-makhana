import mongoose from "mongoose";
import { OrderType } from "./order.model";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "customer"],
      default: "user",
    },
    avatar: { type: String, default: "/diverse-user-avatars.png" },
    address: [
      {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

export type UserType = mongoose.InferSchemaType<typeof userSchema> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  orders: OrderType[];
};
