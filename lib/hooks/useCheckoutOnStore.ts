import { useQuery } from "react-query";

export const useCheckoutOnStore = ({ store_id, variant_ids }) => {
  const { data = { checkout: {} }, isLoading } = useQuery<{
    checkout: any;
  }>(
    ["checkout", store_id, variant_ids],
    () =>
      fetch(
        `/api/checkout?store_id=${store_id}&variant_ids=${variant_ids}`
      ).then((response) => response.json()),
    {
      enabled: !!store_id && !!variant_ids,
    }
  );
  return {
    isLoading,
    checkout: data.checkout,
  };
};
