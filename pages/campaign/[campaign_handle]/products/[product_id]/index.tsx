import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { useProductOnStore } from "@/lib/hooks/useProductOnStore";
import NavBar from "../../../../../components/Navbar";
import ProductPage from "../../../../../components/ProductPage";
import Spinner from "../../../../../components/Spinner";

const ProductCampaignPage = () => {
  const router = useRouter();
  const { campaign_handle, product_id } = router.query;
  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    campaign_handle,
  });
  const { isLoading: productLoading, product } = useProductOnStore({
    store_id: campaign?.storeId,
    product_id,
  });

  if (campaignLoading || productLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar {...{ campaign, campaign_handle }} />
      <ProductPage {...{ product }} />
    </div>
  );
};

export default ProductCampaignPage;
