import isShopAvailable from "@/utils/middleware/isShopAvailable";
import {
  Badge,
  CalloutCard,
  Card,
  HorizontalStack,
  Layout,
  Link,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import usePublication from "@/lib/hooks/app/usePublication";
import CampaignListing from "@/components/campaign/List";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import getIdFromGid from "@/utils/getIdFromGid";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const AppHomePage = () => {
  const router = useRouter();
  const {
    settings: { shop: domain, domain: identifier },
  } = useStoreSettings();
  const { id: publicationId, listing, isLoading } = usePublication();

  const availableCollectionCount = listing.length;
  const unassignedCollections = listing.filter((item) => !item.isCampaign);
  const unassignedCollectionsCount = unassignedCollections.length;

  const assignedCollections = listing.filter((item) => item.isCampaign);
  const draftCampaignsCount = assignedCollections.reduce(
    (acc, item) => (item.isActive ? acc : acc + 1),
    0
  );
  const activeCampaignsCount = assignedCollections.reduce(
    (acc, item) => (item.isActive ? acc + 1 : acc),
    0
  );

  if (isLoading)
    return (
      <SkeletonPage title="Overview">
        <VerticalStack gap="4">
          <Card>
            <VerticalStack gap="4">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </VerticalStack>
          </Card>

          <Card>
            <VerticalStack gap="4">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </VerticalStack>
          </Card>

          <Card>
            <VerticalStack gap="4">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </VerticalStack>
          </Card>
        </VerticalStack>
      </SkeletonPage>
    );

  // TODO: Replace with Onboarding page
  if (!identifier) {
    return (
      <Page title="Overview">
        <Layout>
          <Layout.Section fullWidth>
            <VerticalStack gap="4">
              <CalloutCard
                title="Get your domain"
                primaryAction={{
                  content: "Configure domain",
                  onAction: () => {
                    router.push("/app/settings?initial=true");
                  },
                }}
                illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
              >
                <p>
                  Get your custom Atelier domain so your customers can easily
                  identify you.
                </p>
              </CalloutCard>
            </VerticalStack>
          </Layout.Section>
        </Layout>
        <div className="h-16" />
      </Page>
    );
  }

  return (
    <Page title="Overview">
      <Layout>
        <Layout.Section fullWidth>
          <VerticalStack gap="4">
            <Card>
              <VerticalStack gap="4">
                <HorizontalStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    {availableCollectionCount} collection
                    {availableCollectionCount === 1 ? "" : "s"} available to
                    Atelier
                  </Text>

                  <Link
                    target="_blank"
                    url={`https://${domain}/admin/bulk?resource_name=Collection&edit=publications.${getIdFromGid(
                      publicationId
                    )}.published_at`}
                  >
                    Manage availability
                  </Link>
                </HorizontalStack>

                <HorizontalStack gap="4">
                  <Badge status="warning">Unassigned</Badge>

                  <Text as="p" variant="bodyMd">
                    {unassignedCollectionsCount} collection
                    {unassignedCollectionsCount === 1 ? "" : "s"} without a
                    campaign
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="4">
                  <Badge status="new">Draft</Badge>

                  <Text as="p" variant="bodyMd">
                    {draftCampaignsCount} campaign
                    {draftCampaignsCount === 1 ? "" : "s"} in draft mode
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="4">
                  <Badge status="success">Active</Badge>

                  <Text as="p" variant="bodyMd">
                    {activeCampaignsCount} active campaign
                    {activeCampaignsCount === 1 ? "" : "s"}
                  </Text>
                </HorizontalStack>
              </VerticalStack>
            </Card>

            <CampaignListing listing={listing} />
          </VerticalStack>
        </Layout.Section>
      </Layout>
      <div className="h-16" />
    </Page>
  );
};

export default AppHomePage;
