import { useQuery } from "react-query";

// Takes an array of product_ids as an argument
export const useProductsOnStore = ({ store_id, product_ids }) => {
  const { data = { products: [] }, isLoading } = useQuery<{
    products: any[];
  }>(
    ["products", store_id, product_ids],
    async () => {
      const params = new URLSearchParams({ store_id, product_ids });
      const response = await fetch(`/api/products?${params.toString()}`);
      return await response.json();
    },
    {
      enabled: !!store_id && product_ids.length > 0,
    }
  );

  return {
    isLoading,
    products: data.products,
  };
};
