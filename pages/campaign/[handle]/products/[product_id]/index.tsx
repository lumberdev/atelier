import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { useProductOnStore } from "@/lib/hooks/useProductOnStore";
import NavBar from "@/components/Navbar";
import ProductPage from "@/components/ProductPage";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

const ProductCampaignPage = () => {
  const router = useRouter();
  const { handle, product_id } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    handle,
  });
  const { isLoading: productLoading, product } = useProductOnStore({
    store_id: campaign?.storeId,
    product_id,
  });

  if (campaignLoading || productLoading) return <LoadingScreen />;

  return (
    <Page>
      <NavBar {...{ campaign, handle }} />
      <ProductPage {...{ product }} />
    </Page>
  );
};

export default ProductCampaignPage;