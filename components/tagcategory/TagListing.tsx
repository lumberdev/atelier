import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { TagCategory } from "@/lib/types";
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

const TagListing: FC<{ listing: TagCategory[] }> = ({
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
        {listing.map((tag) => {
          return (
            <Card key={tag.id}>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <InlineStack gap="200">
                    <Text as="h2" variant="headingLg">
                      {tag.name}
                    </Text>
                  </InlineStack>

                  {/* <Link
                    target="_blank"
                    url={`https://${domain}/admin/collections/${getIdFromGid(
                      item.id
                    )}`}
                  >
                    Manage collection
                  </Link> */}
                </InlineStack>
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

export default TagListing;
