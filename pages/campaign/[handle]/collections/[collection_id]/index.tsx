import { useRouter } from "next/router";
import { useCampaign } from "@/lib/hooks/store/useCampaign";
import { useCollections } from "@/lib/hooks/store/useCollections";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import AnnouncementBar from "@/components/AnnouncementBar";

const CollectionCampaignPage = () => {
  const router = useRouter();
  const { handle, collection_id } = router.query;

  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };
  const collectionTextColor = backgroundColor
    ? pickTextColorBasedOnBgColorAdvanced(backgroundColor, "white", "black")
    : "";

  const { isLoading: campaignLoading, campaign } = useCampaign({
    handle,
  });
  const { collections, isLoading: collectionsLoading } = useCollections({
    store_id: campaign.storeId,
    collection_ids: campaign?.collectionIds,
  });

  if (campaignLoading || collectionsLoading) return <LoadingScreen />;

  const selectedCollection = collections.find(
    (collection) => collection.id.match(/\d+/)[0] === collection_id
  );
  const collectionProducts = selectedCollection?.products;

  return (
    <Page {...{ campaign }}>
      <AnnouncementBar
        announcement={campaign?.announcement}
        className="hidden lg:block"
      />
      <Header {...{ campaign, campaignHandle: handle, collections }} />
      <h1
        className="mx-1 mx-4 mr-auto mt-4 text-xl text-black xs:mx-16 xs:my-8 xs:mr-auto xs:text-3xl "
        style={{ color: collectionTextColor }}
      >
        {selectedCollection?.title}
      </h1>
      <ProductGrid {...{ products: collectionProducts, handle }} />
    </Page>
  );
};

export default CollectionCampaignPage;
