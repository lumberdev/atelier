import { useRouter } from "next/router";
import { useCampaignOnStore } from "@/lib/hooks/useCampaignOnStore";
import NavBar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/Page";

const CollectionPage = () => {
  const router = useRouter();
  const { handle, collection_id } = router.query;

  const { isLoading: campaignLoading, campaign } = useCampaignOnStore({
    handle,
  });

  if (campaignLoading) return <LoadingScreen />;

  return (
    <Page>
      <NavBar {...{ campaign, handle }} />
      Collection: {collection_id}
    </Page>
  );
};

export default CollectionPage;
