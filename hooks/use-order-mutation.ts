import { createCODOrder } from "@/lib/client/order-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function useOrderMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: codOrderData,
    mutate: codOrderMutation,
    isPending: isCODOrderCreating,
    error: codOrderError,
    isError: isCODOrderError,
    isSuccess: isCODOrderSuccess,
  } = useMutation({
    mutationFn: createCODOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // handle code order creation error and success
  useEffect(() => {
    if (codOrderError || isCODOrderError) {
      toast.error(codOrderError.message);
    }

    if (isCODOrderSuccess) {
      toast.success("Your order has been placed successfully.");
      router.replace(`/order-success?orderId=${codOrderData?.order?._id}`);
    }
  }, [codOrderData, codOrderError, isCODOrderError, isCODOrderSuccess, router]);

  return {
    codOrderMutation,
    isCODOrderCreating,
    codOrderData,
    isCODOrderSuccess,
  };
}
