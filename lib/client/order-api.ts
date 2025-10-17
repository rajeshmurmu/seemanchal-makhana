import { AxiosError } from "axios";
import apiClient from "./axios-client";
import { CartItem } from "@/types/types";

export const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  clientOrderId,
  items,
  deliveryAddress,
}: {
  amount: number; // in paise
  items: CartItem[];
  clientOrderId: string;
  deliveryAddress: string;
  currency?: string;
  receipt?: string;
}) => {
  try {
    const response = await apiClient.post("/api/razorpay/order", {
      amount,
      currency,
      receipt,
      items,
      clientOrderId,
      deliveryAddress,
    });

    if (response.status !== 200 || !response.data.razorpayOrderId) {
      throw new Error("Order creation failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const verifyRazorpayPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  clientOrderId,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  clientOrderId?: string;
}) => {
  try {
    const response = await apiClient.post("/api/razorpay/payment/verify", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      clientOrderId,
    });

    if (response.status !== 200 || response.data.error) {
      throw new Error(response.data.error || "Payment verification failed");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const fetchAllOrders = async () => {
  try {
    const response = await apiClient.get("/api/admin/orders");
    if (response.status !== 200) {
      throw new Error("Failed to fetch orders");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const createCODOrder = async ({
  amount,
  items,
  clientOrderId,
  currency = "INR",
  receipt,
  deliveryAddress,
}: {
  amount: number; // in paise
  items: CartItem[];
  clientOrderId: string;
  deliveryAddress: string;
  currency?: string;
  receipt?: string;
}) => {
  try {
    const response = await apiClient.post("/api/orders/cod", {
      amount,
      items,
      clientOrderId,
      currency,
      receipt,
      deliveryAddress,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};
