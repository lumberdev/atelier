import isShopAvailable from "@/utils/middleware/isShopAvailable";
import {
  Badge,
  CalloutCard,
  Card,
  InlineStack,
  Layout,
  Link,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import usePublication from "@/lib/hooks/app/usePublication";
import TagListing from "@/components/tagcategory/TagListing";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { TagCategory } from "@/lib/types";
import getIdFromGid from "@/utils/getIdFromGid";
import prisma from "@/utils/prisma";


//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps() {
  const tagList: TagCategory[] = await prisma.categoryTag.findMany();

  return {
    props: {
        tagList
    }
  }
}

const TagManagerPage = ({ tagList }) => {
  const router = useRouter();
  const {
    settings: { shop: domain, domain: identifier },
  } = useStoreSettings();
  const { id: publicationId, listing, isLoading } = usePublication();

  const tagCount = tagList.length;


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
      <SkeletonPage title="Tag Manager">
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </Card>
        </BlockStack>
      </SkeletonPage>
    );

  // TODO: Replace with Onboarding page
  if (!identifier) {
    return (
      <Page title="Tag Manager">
        <Layout>
          <Layout.Section variant="fullWidth">
            <BlockStack gap="400">
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
            </BlockStack>
          </Layout.Section>
        </Layout>
        <div className="h-16" />
      </Page>
    );
  }

  return (
    <Page title="Tag Manager">
      <Layout>
        <Layout.Section variant="fullWidth">
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    {tagCount} Tag
                    {tagCount === 1 ? "" : "s"}
                  </Text>

                  {/* <Link
                    target="_blank"
                    url={`https://${domain}/admin/bulk?resource_name=Collection&edit=publications.${getIdFromGid(
                      publicationId
                    )}.published_at`}
                  >
                    Manage availability
                  </Link> */}
                </InlineStack>

                <InlineStack gap="400">
                  <Badge tone="warning">Unassigned</Badge>

                  <Text as="p" variant="bodyMd">
                    {unassignedCollectionsCount} collection
                    {unassignedCollectionsCount === 1 ? "" : "s"} without a
                    campaign
                  </Text>
                </InlineStack>

                <InlineStack gap="400">
                  <Badge tone="new">Draft</Badge>

                  <Text as="p" variant="bodyMd">
                    {draftCampaignsCount} campaign
                    {draftCampaignsCount === 1 ? "" : "s"} in draft mode
                  </Text>
                </InlineStack>

                <InlineStack gap="400">
                  <Badge tone="success">Active</Badge>

                  <Text as="p" variant="bodyMd">
                    {activeCampaignsCount} active campaign
                    {activeCampaignsCount === 1 ? "" : "s"}
                  </Text>
                </InlineStack>
              </BlockStack>
            </Card>

            <TagListing listing={tagList} />
          </BlockStack>
        </Layout.Section>
      </Layout>
      <div className="h-16" />
    </Page>
  );
};

export default TagManagerPage;
