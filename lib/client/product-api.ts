import { ProductFormData, ResponseProductType } from "@/types/types";
import apiClient from "./axios-client";
import { AxiosError } from "axios";

export const addNewProduct = async (data: ProductFormData) => {
  try {
    const res = await apiClient.post("/api/admin/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const getAllProducts = async (params: Record<string, string>) => {
  try {
    const searchParams = new URLSearchParams(params);
    const res = await apiClient.get(
      `/api/products?page=${params.page || 1}&limit=${
        params.limit || 10
      }&${searchParams.toString()}`
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch products");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const getSingleProduct = async (productId: string) => {
  try {
    const res = await apiClient.get(`/api/products/${productId}`);

    if (res.status !== 200) {
      throw new Error("Failed to fetch product");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const getProductWithSlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await apiClient.get(`/api/products/${slug}`);

    if (res.status !== 200) {
      throw new Error("Failed to fetch product");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const res = await apiClient.delete(`/api/admin/products/${productId}`);

    if (res.status !== 200) {
      throw new Error("Failed to delete product");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const updateProduct = async ({
  productId,
  data,
}: {
  data: Partial<ProductFormData | ResponseProductType>;
  productId: string | undefined;
}) => {
  try {
    const res = await apiClient.put(`/api/admin/products/${productId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status !== 200) {
      throw new Error("Failed to update product");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const addNewCategory = async ({ category }: { category: string }) => {
  try {
    const res = await apiClient.post("/api/admin/products/category", {
      name: category,
    });
    if (res.status !== 201) {
      throw new Error("Failed to add new category");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};

export const getAllCategories = async () => {
  try {
    const res = await apiClient.get("/api/admin/products/category");
    if (res.status !== 200) {
      throw new Error("Failed to fetch categories");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error(JSON.stringify(error) || "Something went wrong");
  }
};
