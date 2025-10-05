import z from "zod";
import { productSchema } from "@/shared/schema/product-schema";
import { ReviewType } from "@/models/review.model";

export type ProductFormData = z.infer<typeof productSchema>;

export type Category = {
  _id: string;
  key: string;
  name: string;
};

export interface ProductWithAdditionalFields extends ProductFormData {
  _id: string;
  slug?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
}

export type ResponseProductType = ProductWithAdditionalFields & {
  images: string[];
  reviews?: ReviewType[];
};

export interface CartItem {
  product: ResponseProductType;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface SessionUser {
  id: string;
  role: "admin" | "customer" | "user";
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}
