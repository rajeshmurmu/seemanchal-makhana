import axios, { AxiosInstance } from "axios";

interface ShiprocketCredentials {
  email: string;
  password: string;
}

interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
}

interface OrderData {
  order_id: string;
  order_date?: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  order_items: OrderItem[];
  payment_method: "Prepaid" | "COD";
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

export class ShiprocketSDK {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private credentials: ShiprocketCredentials;

  constructor() {
    this.credentials = {
      email: process.env.SHIPROCKET_EMAIL!,
      password: process.env.SHIPROCKET_PASSWORD!,
    };

    this.axiosInstance = axios.create({
      baseURL: "https://apiv2.shiprocket.in/v1/external",
    });
  }

  private async refreshToken() {
    const res = await this.axiosInstance.post("/auth/login", this.credentials);
    this.token = res.data.token;
    this.tokenExpiry = Date.now() + 9.5 * 60 * 60 * 1000; // 9.5 hours
    console.log("🔐 Shiprocket token refreshed");
    return this.token;
  }

  private async getToken() {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }
    return await this.refreshToken();
  }

  // Generic request handler
  private async request<T>(
    method: "get" | "post",
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ): Promise<T> {
    const token = await this.getToken();

    const response = await this.axiosInstance.request<T>({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  // Create Order
  async createOrder(orderData: OrderData) {
    return this.request("post", "/orders/create/adhoc", orderData);
  }

  // Track Shipment
  async trackShipment(awb: string) {
    return this.request("get", `/courier/track/awb/${awb}`);
  }

  // Assign Courier
  async assignCourier(orderId: number, courierId: number) {
    return this.request("post", "/courier/assign/awb", {
      order_id: orderId,
      courier_id: courierId,
    });
  }

  // Check Serviceability (Available Couriers)
  async getServiceability(pincode: string, weight = 1) {
    return this.request("post", "/courier/serviceability", {
      pickup_postcode: "110030", // Your pickup pin
      delivery_postcode: pincode,
      weight,
    });
  }
}

export const shiprocketSDK = new ShiprocketSDK();
