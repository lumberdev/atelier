import { useQuery } from "react-query";

export const useProduct = ({ store_id, product_id }) => {
  const { data = { product: {} }, isLoading } = useQuery<{
    product: any;
  }>(
    ["product", store_id, product_id],
    async () => {
      const params = new URLSearchParams({ store_id, product_id });
      const response = await fetch(`/api/product?${params.toString()}`);
      const data = (await response.json()) as any;
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
    },
    {
      enabled: !!store_id && !!product_id,
    }
  );
  return {
    isLoading,
    product: data.product,
  };
};
