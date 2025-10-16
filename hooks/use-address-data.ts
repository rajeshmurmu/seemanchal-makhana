import { fetchAddress } from "@/lib/client/address-api";
import { AddressType } from "@/models/address.model";
import { Address } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAddressData() {
  const [addressData, setAddressData] = useState<
    Address[] | AddressType[] | null
  >(null);
  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["address"],
    queryFn: fetchAddress,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setAddressData(data?.address);
    }
  }, [data, isSuccess]);

  // Handle errors
  useEffect(() => {
    if (error || isError) {
      console.error("Error fetching address:", error);
      setAddressData(null);
    }
  }, [error, isError]);

  return {
    addressData,
    isLoading,
  };
}
