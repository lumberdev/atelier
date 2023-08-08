import CampaignForm from "@/components/CampaignForm";
import { Page } from "@shopify/polaris";
import { useRouter } from "next/router";

const NewCampaignPage = () => {
  const router = useRouter();

  return (
    <Page
      title="Add Campaign"
      backAction={{
        content: "Campaigns",
        onAction: () => {
          router.back();
        },
      }}
    >
      <CampaignForm />
    </Page>
  );
};

export default NewCampaignPage;