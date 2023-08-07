import { Frame, Page } from "@shopify/polaris";
import { useRouter } from "next/router";

const PreviewCampaignPage = () => {
  const router = useRouter();
  return (
    <Frame>
      <Page
        title="Preview"
        backAction={{
          content: "Campaigns",
          onAction: () => {
            router.back();
          },
        }}
      >
        HELLO
      </Page>
    </Frame>
  );
};

export default PreviewCampaignPage;
