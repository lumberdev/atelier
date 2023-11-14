import { useQuery } from "react-query";

export const useProductOnStore = ({ store_id, product_id }) => {
  const { data = { product: {} }, isLoading } = useQuery<{
    product: any;
  }>(
    ["product", store_id, product_id],
    () =>
      fetch(`/api/product?store_id=${store_id}&product_id=${product_id}/`)
        .then((response) => response.json())
        .then((data) => {
          return {
            product: {
              id: data.product.id,
              title: data.product.title,
              description: data.product.description,
              priceRangeV2: data.product.priceRangeV2,
              options: data.product.options,
              handle: data.product.handle,
              images: data.product.images.edges.map((edge) => edge.node),
              variants: data.product.variants.edges.map((edge) => edge.node),
            },
          };
        }),
    {
      enabled: !!store_id && !!product_id,
    }
  );
  return {
    isLoading,
    product: data.product,
  };
};
