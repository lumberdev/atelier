import { useRouter } from "next/router";

const ProductCampaignPage = () => {
  const router = useRouter();
  const { product_id } = router.query;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Product Campaign Page</h1>
      <p>Product ID: {product_id}</p>
    </div>
  );
};

export default ProductCampaignPage;
