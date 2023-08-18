import { useQuery } from "react-query";

export const useProductsOnStore = ({ store_id }) => {
  const { data = { products: [] }, isLoading } = useQuery<{
    products: any[];
  }>(
    ["products", store_id],
    () =>
      fetch(`/api/products?store_id=${store_id}`)
        .then((response) => response.json())
        .then((data) => {
          return {
            products: data.products.map((product) => {
              return {
                id: product.node.id,
                title: product.node.title,
                priceRangeV2: product.node.priceRangeV2,
                updatedAt: product.node.updatedAt,
                handle: product.node.handle,
                featuredImage: product.node.featuredImage,
              };
            }),
          };
        }),
    {
      enabled: !!store_id,
    }
  );

  return {
    isLoading,
    products: data.products,
  };
};
