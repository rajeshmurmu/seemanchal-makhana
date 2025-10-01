import z from "zod";
import { productSchema } from "@/shared/schema/product-schema";

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

export type ResponseProductType = Omit<
  ProductWithAdditionalFields,
  "images"
> & {
  images: string[];
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
