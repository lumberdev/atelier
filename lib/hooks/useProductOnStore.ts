import { useQuery } from "react-query";

export const useProductOnStore = ({ store_id, product_id }) => {
  const { data = { product: {} }, isLoading } = useQuery<{
    product: any;
  }>(["product", store_id, product_id], () =>
    fetch(`/api/product?store_id=${store_id}&product_id=${product_id}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
  );
  return {
    isLoading,
    product: data.product,
  };
};
