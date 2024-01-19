import { useCampaigns } from "@/lib/hooks/app/useCampaigns";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  Badge,
  Box,
  Button,
  CalloutCard,
  Card,
  EmptyState,
  Grid,
  HorizontalStack,
  Icon,
  Layout,
  LegacyCard,
  Link,
  Loading,
  MediaCard,
  Page,
  ResourceItem,
  ResourceList,
  ResourceListProps,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { AddMajor } from "@shopify/polaris-icons";
import { campaigns } from "@prisma/client";
import { supabaseStorage } from "@/utils/supabase";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { useState } from "react";
import useShop from "@/lib/hooks/app/useShop";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const AppHomePage = () => {
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const {
    identifier,
    campaigns,
    isLoading,
    availableProductCount: assignedProductCount,
    unpublishCampaigns,
    deleteCampaigns,
    publishCampaigns,
  } = useCampaigns();
  const { settings } = useStoreSettings();
  const { domain, availableProductCount, publicationId } = useShop();
  const subdomain = settings.domain;

  const unassignedProductCount = availableProductCount - assignedProductCount;

  if (isLoading)
    return (
      <Page title="Campaigns">
        <Layout>
          <Loading />
        </Layout>
      </Page>
    );

  if (!identifier) {
    return (
      <Page title="Campaigns">
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
    <Page title="Campaigns">
      <Layout>
        <Layout.Section fullWidth>
          <VerticalStack gap="4">
            <CalloutCard
              title="Start selling on Atelier"
              illustration=""
              primaryAction={{
                content: "Publish products",
                external: true,
                url: `https://${domain}/admin/bulk?resource_name=Product&edit=publications.${
                  publicationId.split("/").reverse()[0]
                }.published_at`,
              }}
            >
              <p>Setup your exclusive sales on Atelier.</p>
            </CalloutCard>

            <Card>
              <VerticalStack gap="4">
                <HorizontalStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    {availableProductCount} product
                    {availableProductCount === 1 ? "" : "s"} available to
                    Atelier
                  </Text>

                  <Link
                    target="_blank"
                    url={`https://${domain}/admin/bulk?resource_name=Product&edit=publications.${
                      publicationId.split("/").reverse()[0]
                    }.published_at`}
                  >
                    Manage availability
                  </Link>
                </HorizontalStack>

                {unassignedProductCount && (
                  <HorizontalStack gap="4">
                    <Badge status="warning">Unassigned</Badge>

                    <Text as="p" variant="bodyMd">
                      {unassignedProductCount} product
                      {availableProductCount - assignedProductCount === 1
                        ? ""
                        : "s"}{" "}
                      not assigned to a campaign
                    </Text>
                  </HorizontalStack>
                )}

                <HorizontalStack gap="4">
                  <Badge status="success">Assigned</Badge>

                  <Text as="p" variant="bodyMd">
                    {assignedProductCount} product
                    {assignedProductCount === 1 ? "" : "s"} correctly assigned
                    to a campaign
                  </Text>
                </HorizontalStack>
              </VerticalStack>
            </Card>

            <Card padding="0">
              <ResourceList
                emptyState={
                  <EmptyState
                    heading="Setup your first campaign"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    action={{
                      content: "Create campaign",
                      onAction: () => {
                        router.push("/app/campaign/new");
                      },
                      icon: () => <Icon source={AddMajor} />,
                    }}
                  >
                    <p className="mb-12">
                      A campaign is the foundation of Atelier, you can create as
                      many campaigns as you want, each getting its own url,
                      product listing and theme.
                    </p>
                  </EmptyState>
                }
                alternateTool={
                  <Button
                    onClick={() => router.push("/app/campaign/new")}
                    size="slim"
                    plain
                  >
                    Add campaign
                  </Button>
                }
                selectable
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                items={campaigns}
                promotedBulkActions={[
                  {
                    content: "Delete",
                    onAction: () => {
                      if (selectedItems.length)
                        deleteCampaigns(
                          { ids: selectedItems as string[] },
                          { onSuccess: () => setSelectedItems([]) }
                        );
                    },
                  },
                  {
                    content: "Unpublish",
                    onAction: () => {
                      if (selectedItems.length)
                        unpublishCampaigns(
                          { ids: selectedItems as string[] },
                          { onSuccess: () => setSelectedItems([]) }
                        );
                    },
                  },
                  {
                    content: "Publish",
                    onAction: () => {
                      if (selectedItems.length)
                        publishCampaigns(
                          { ids: selectedItems as string[] },
                          { onSuccess: () => setSelectedItems([]) }
                        );
                    },
                  },
                ]}
                renderItem={(resource) => {
                  const campaign = resource as campaigns;
                  const image = campaign.image
                    ? supabaseStorage.getPublicUrl(campaign.image)
                    : "";
                  const previewTokenQuery =
                    !campaign?.isActive && campaign.previewToken
                      ? `?preview_token=${campaign.previewToken}`
                      : "";

                  return (
                    <ResourceItem
                      key={`${campaign.id}-${campaign.updatedAt}`}
                      id={campaign.id}
                      onClick={() =>
                        router.push(`/app/campaign/${campaign.id}`)
                      }
                      media={
                        <div className="h-14 w-14 overflow-hidden rounded-md bg-gray-200 md:h-20 md:w-20">
                          {image && (
                            <img
                              src={image.data.publicUrl}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      }
                    >
                      <div className="min-h-14 min-w-14 md:min-h-20 md:min-w-20  flex h-full items-center justify-between gap-4">
                        <div className="flex w-full items-center justify-start">
                          <Text as="h4" variant="headingMd" fontWeight="bold">
                            {campaign.title}
                          </Text>
                        </div>
                        <div className="flex flex-col items-end justify-between gap-4">
                          {campaign.isActive ? (
                            <Badge status="success" progress="complete">
                              Active
                            </Badge>
                          ) : (
                            <Badge progress="incomplete">Draft</Badge>
                          )}
                          <a
                            href={`${
                              process.env.NODE_ENV === "production"
                                ? `https://${subdomain}.atelier.sale`
                                : `http://${subdomain}.localhost:3000`
                            }/${campaign.handle}${previewTokenQuery}`}
                            target="_blank"
                            className="text-gray-00  rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-[#444] no-underline hover:bg-gray-400"
                          >
                            {campaign.isActive ? "View" : "Preview"}
                          </a>
                        </div>
                      </div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </VerticalStack>
        </Layout.Section>
      </Layout>
      <div className="h-16" />
    </Page>
  );
};

export default AppHomePage;
