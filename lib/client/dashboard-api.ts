import { AxiosError } from "axios";
import apiClient from "./axios-client";

export async function fetchDashboardMetrics() {
  try {
    const response = await apiClient.get("/api/admin/dashboard");

    if (response.status !== 200 || !response.data.metrics) {
      throw new Error("Failed to fetch dashboard metrics");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
}

export async function fetchSalesTrend() {
  try {
    const response = await apiClient.get("/api/admin/dashboard/sales-trend");

    if (response.status !== 200 || !response.data.salesData) {
      throw new Error("Failed to fetch sales trend data");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
}

export async function fetchTopProducts() {
  try {
    const response = await apiClient.get("/api/admin/dashboard/top-products");

    if (response.status !== 200 || !response.data.topProducts) {
      throw new Error("Order creation failed");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
}
export async function fetchRecentOrders() {
  const response = await apiClient.get("/admin/dashboard/recent-orders");
  return response.data;
}
