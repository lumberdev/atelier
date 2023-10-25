import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { useProductOnStore } from "@/lib/hooks/useProductOnStore";
import { useCollectionsOnStore } from "@/lib/hooks/useCollectionsOnStore";
import Header from "@/components/Header";
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

  const { collections, isLoading: collectionsLoading } = useCollectionsOnStore({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });

  if (campaignLoading || productLoading) return <LoadingScreen />;

  return (
    <Page>
      <Header {...{ campaign, campaignHandle: handle, collections }} />
      <ProductPage {...{ campaign, product }} />
    </Page>
  );
};

export default ProductCampaignPage;
