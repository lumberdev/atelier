import CampaignPage from "@/components/campaign/Page";
import CampaignSkeletonPage from "@/components/campaign/SkeletonPage";
import useCollection from "@/lib/hooks/app/useCollection";
import { useRouter } from "next/router";

const NewCampaignPage = () => {
  const router = useRouter();
  const { isLoading, ...collection } = useCollection(
    router.query.collection_id as string
  );

  if (isLoading) return <CampaignSkeletonPage />;

  return (
    <CampaignPage
      collection={collection}
      backAction={{
        content: "Campaigns",
        onAction: () => {
          router.back();
        },
      }}
    />
  );
};

export default NewCampaignPage;
