import { AxiosError } from "axios";
import apiClient from "./axios-client";

export const fetchAllUsers = async () => {
  try {
    const res = await apiClient.get("/api/admin/users");

    if (res.status !== 200) {
      throw new Error("Failed to fetch users");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const deleteUserById = async ({ id }: { id: string }) => {
  try {
    const res = await apiClient.delete(`/api/admin/users/${id}`);

    if (res.status !== 200) {
      throw new Error("Failed to delete user");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Failed to delete user");
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};
