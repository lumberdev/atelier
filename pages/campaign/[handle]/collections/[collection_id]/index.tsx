import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import { useCollectionsOnStore } from "@/lib/hooks/useCollectionsOnStore";
import NavBar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

const CollectionCampaignPage = () => {
  const router = useRouter();
  const { handle, collection_id } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    handle,
  });
  const { collections, isLoading: collectionsLoading } = useCollectionsOnStore({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });

  if (campaignLoading || collectionsLoading) return <LoadingScreen />;

  const selectedCollection = collections.find(
    (collection) => collection.id.match(/\d+/)[0] === collection_id
  );
  const collectionProducts = selectedCollection?.products;

  return (
    <Page>
      <NavBar {...{ campaign, campaignHandle: handle, collections }} />
      <h1 className="text-2xl sm:text-4xl text-black mx-1 my-4 sm:my-8 mx-16 mr-auto ">
        {selectedCollection?.title}
      </h1>
      <ProductGrid {...{ products: collectionProducts, handle }} />
    </Page>
  );
};

export default CollectionCampaignPage;
