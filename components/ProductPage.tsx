import { useProductOnStore } from "@/lib/hooks/useProductOnStore";

const ProductPage = ({ campaign, product_id }) => {
  const product = useProductOnStore({
    store_id: campaign.storeId,
    product_id: product_id,
  });
  return <div>{JSON.stringify(product)}</div>;
};

export default ProductPage;
