import { AxiosError } from "axios";
import apiClient from "./axios-client";
import { AddressInput } from "@/types/types";

export const createAddress = async ({ address }: { address: AddressInput }) => {
  try {
    const res = await apiClient.post("/api/address", { address });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const fetchAddress = async () => {
  try {
    const res = await apiClient.get("/api/address");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const deleteAddress = async ({ addressId }: { addressId: string }) => {
  try {
    const res = await apiClient.delete(`/api/address/${addressId}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const setDefaultAddress = async ({
  addressId,
  address,
}: {
  addressId: string;
  address: AddressInput;
}) => {
  try {
    const res = await apiClient.put(`/api/address/${addressId}`, {
      address: { ...address, isDefault: true },
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const updateAddress = async ({
  addressId,
  address,
}: {
  addressId: string;
  address: AddressInput;
}) => {
  try {
    const res = await apiClient.put(`/api/address/${addressId}`, { address });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};
