import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/client/address-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function useAddressMutation() {
  const queryClient = useQueryClient();

  //   create address
  const {
    data: addressCreationData,
    mutate: addAddressMutation,
    isPending: isAddressCreating,
    error: addressCreationError,
    isError: isAddressCreationError,
    isSuccess: isAddressCreationSuccess,
  } = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  // handle address creation error and success
  useEffect(() => {
    if (addressCreationError || isAddressCreationError) {
      toast.error(addressCreationError.message);
    }

    if (isAddressCreationSuccess) {
      toast.success("Your address has been saved.");
    }
  }, [addressCreationError, isAddressCreationError, isAddressCreationSuccess]);

  // delete address
  const {
    mutate: deleteAddressMutation,
    isPending: isAddressDeleting,
    error: addressDeletionError,
    isError: isAddressDeletionError,
    isSuccess: isAddressDeletionSuccess,
  } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  // handle address deletion error and success
  useEffect(() => {
    if (addressDeletionError || isAddressDeletionError) {
      toast.error(addressDeletionError.message);
    }

    if (isAddressDeletionSuccess) {
      toast.success("Your address has been deleted.");
    }
  }, [addressDeletionError, isAddressDeletionError, isAddressDeletionSuccess]);

  // set default address

  const {
    mutate: setDefaultAddressMutation,
    isError: setDefaultAddressIsError,
    isSuccess: setDefaultAddressIsSuccess,
    isPending: setDefaultAddressIsPending,
    error: setDefaultAddressError,
  } = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  // handle set default address error and success
  useEffect(() => {
    if (setDefaultAddressError || setDefaultAddressIsError) {
      toast.error(setDefaultAddressError.message);
    }

    if (setDefaultAddressIsSuccess) {
      toast.success("Your default address has been set.");
    }
  }, [
    setDefaultAddressError,
    setDefaultAddressIsError,
    setDefaultAddressIsSuccess,
  ]);

  return {
    // add address
    addressCreationData,
    addAddressMutation,
    isAddressCreating,
    // delete address
    deleteAddressMutation,
    isAddressDeleting,
    // set default address
    setDefaultAddressMutation,
    setDefaultAddressIsPending,
  };
}
