import { useRouter } from "next/router";
import { useCampaign } from "@/lib/hooks/store/useCampaign";
import { useProduct } from "@/lib/hooks/store/useProduct";
import { useCollections } from "@/lib/hooks/store/useCollections";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import ProductPage from "@/components/ProductPage";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

const ProductCampaignPage = () => {
  const router = useRouter();
  const { handle, product_id } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaign({
    handle,
  });
  const { isLoading: productLoading, product } = useProduct({
    store_id: campaign?.storeId,
    product_id,
  });

  const { collections, isLoading: collectionsLoading } = useCollections({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });

  if (campaignLoading || productLoading) return <LoadingScreen />;

  return (
    <Page>
      <AnnouncementBar
        announcement={campaign?.announcement}
        className="hidden lg:block"
      />
      <Header {...{ campaign, campaignHandle: handle, collections }} />
      <ProductPage {...{ campaign, product }} />
    </Page>
  );
};

export default ProductCampaignPage;
