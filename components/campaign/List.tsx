import useShop from "@/lib/hooks/app/useShop";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { PublicationCollectionListing } from "@/lib/types";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  HorizontalStack,
  Link,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { FC } from "react";

const CampaignListing: FC<{ listing: PublicationCollectionListing }> = ({
  listing,
}) => {
  const router = useRouter();
  const {
    settings: { domain },
  } = useStoreSettings();

  return (
    <VerticalStack gap="4">
      {listing.map((item) => (
        <Card key={item.id}>
          <VerticalStack gap="4">
            <HorizontalStack align="space-between">
              <HorizontalStack gap="2">
                <Text as="h2" variant="headingLg">
                  {item.title}
                </Text>

                {item.isCampaign ? (
                  <Badge status={item.isActive ? "success" : "new"}>
                    {item.isActive ? "Published" : "Draft"}
                  </Badge>
                ) : null}
              </HorizontalStack>

              <Link
                target="_blank"
                url={`https://${domain}/admin/collections/${item.id
                  .split("/")
                  .reverse()
                  .at(0)}`}
              >
                Manage collection
              </Link>
            </HorizontalStack>

            <Text as="p" variant="bodyMd">
              {item.productCount} product{item.productCount === 1 ? "" : "s"}{" "}
              available
            </Text>

            {item.isCampaign ? (
              <ButtonGroup>
                <Button>Configure Campaign</Button>

                <Button primary={!item.isActive} destructive={item.isActive}>
                  {item.isActive ? "Unpubish" : "Publish"}
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button
                  onClick={() => {
                    router.push(
                      `/app/campaign/new?collection=${item.id
                        .split("/")
                        .reverse()
                        .at(0)}`
                    );
                  }}
                >
                  Create campaign
                </Button>
              </ButtonGroup>
            )}
          </VerticalStack>
        </Card>
      ))}
    </VerticalStack>
  );
};

export default CampaignListing;
