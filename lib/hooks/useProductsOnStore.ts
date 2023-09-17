import { useQuery } from "react-query";

// Takes an array of product_ids as an argument.
// If no product_ids passed, it will return all products for the store.

export const useProductsOnStore = ({ store_id, product_ids = [] }) => {
  const { data = { products: [] }, isLoading } = useQuery<{
    products: any[];
  }>(
    ["products", store_id, product_ids],
    () =>
      fetch(`/api/products?store_id=${store_id}&product_id=${product_ids}`)
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
