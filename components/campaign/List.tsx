import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { PublicationCollectionListing } from "@/lib/types";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  Link,
  Text,
  Toast,
  BlockStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { FC } from "react";
import { useMutation } from "react-query";
import useFetch from "../hooks/useFetch";
import { useToast } from "@/lib/hooks/app/useToast";
import getIdFromGid from "@/utils/getIdFromGid";

const CampaignListing: FC<{ listing: PublicationCollectionListing }> = ({
  listing,
}) => {
  const router = useRouter();
  const {
    settings: { domain: identifier, shop: domain },
  } = useStoreSettings();
  const fetch = useFetch();
  const { toasts, triggerToast, dismissToast } = useToast();

  const { mutate: updateCampaignStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      fetch(`/api/apps/campaigns/${id}`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }).then((response) => response.json()),
    onSuccess: (response) => {
      triggerToast("Status updated");
    },
  });

  return (
    <>
      <BlockStack gap="400">
        {listing.map((item) => {
          const previewTokenQuery = new URLSearchParams({
            preview_token: item.previewToken,
          });

          const previewDomain =
            process.env.NODE_ENV === "production"
              ? `https://${identifier}.atelier.sale`
              : `http://${identifier}.localhost:3000`;

          return (
            <Card key={item.id}>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <InlineStack gap="200">
                    <Text as="h2" variant="headingLg">
                      {item.title}
                    </Text>

                    {item.isCampaign ? (
                      <Badge tone={item.isActive ? "success" : "new"}>
                        {item.isActive ? "Published" : "Draft"}
                      </Badge>
                    ) : null}
                  </InlineStack>

                  <Link
                    target="_blank"
                    url={`https://${domain}/admin/collections/${getIdFromGid(
                      item.id
                    )}`}
                  >
                    Manage collection
                  </Link>
                </InlineStack>

                <Text as="p" variant="bodyMd">
                  {item.productCount} product
                  {item.productCount === 1 ? "" : "s"} available
                </Text>

                {item.isCampaign ? (
                  <ButtonGroup>
                    <Button
                      onClick={() =>
                        router.push(`/app/campaign/${item.campaignId}`)
                      }
                    >
                      Configure Campaign
                    </Button>

                    <Button
                      target="_blank"
                      url={`${previewDomain}/${item.handle}${
                        item.isActive ? "" : "?" + previewTokenQuery.toString()
                      }`}
                    >
                      {item.isActive ? "Go to Campaign" : "Preview"}
                    </Button>

                    <Button
                      onClick={() =>
                        updateCampaignStatus({
                          id: item.campaignId,
                          status: !item.isActive,
                        })
                      }
                      variant={!item.isActive ? "primary" : "plain"}
                      tone={item.isActive ? "critical" : "success"}
                    >
                      {item.isActive ? "Unpubish" : "Publish"}
                    </Button>
                  </ButtonGroup>
                ) : (
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        router.push(
                          `/app/campaign/new?collection_id=${getIdFromGid(
                            item.id
                          )}`
                        );
                      }}
                    >
                      Create campaign
                    </Button>
                  </ButtonGroup>
                )}
              </BlockStack>
            </Card>
          );
        })}
      </BlockStack>

      {toasts.map((toast, index) => (
        <Toast
          content={toast}
          onDismiss={() => dismissToast(index)}
          key={index}
        />
      ))}
    </>
  );
};

export default CampaignListing;
