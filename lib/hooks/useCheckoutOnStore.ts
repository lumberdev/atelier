import { useQuery } from "react-query";

export const useCheckoutOnStore = ({ store_id, line_items }) => {
  const { data = { checkout: {} }, isLoading } = useQuery<{
    checkout: any;
  }>(
    ["checkout", store_id, line_items],
    () =>
      fetch(`/api/checkout?store_id=${store_id}&line_items=${line_items}`).then(
        (response) => response.json()
      ),
    {
      enabled: !!store_id && !!line_items,
    }
  );
  return {
    isLoading,
    checkout: data.checkout,
  };
};
