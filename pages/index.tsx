import { useCampaigns } from "@/lib/hooks/useCampaigns";
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
  Icon,
  Layout,
  LegacyCard,
  Loading,
  MediaCard,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { AddMajor } from "@shopify/polaris-icons";
import { campaigns } from "@prisma/client";
import { supabaseStorage } from "@/utils/supabase";
import { useStoreSettings } from "@/lib/hooks/useStoreSettings";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = () => {
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const { identifier, campaigns, isLoading } = useCampaigns();
  const { settings } = useStoreSettings();
  const subdomain = settings.domain;

  if (isLoading)
    return (
      <Page title="Campaigns">
        <Layout>
          <Loading />
        </Layout>
      </Page>
    );

  return (
    <Page title="Campaigns">
      <Layout>
        <Layout.Section fullWidth>
          <VerticalStack gap="4">
            {!identifier && (
              <Layout.Section fullWidth>
                <CalloutCard
                  title="Get your domain"
                  primaryAction={{
                    content: "Configure domain",
                    onAction: () => {
                      router.push("/settings");
                    },
                  }}
                  illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                >
                  <p>
                    Get your custom Atelier domain so your customers can easily
                    identify you.
                  </p>
                </CalloutCard>
              </Layout.Section>
            )}

            <Grid>
              {campaigns.map((campaign) => {
                const image = campaign.image
                  ? supabaseStorage.getPublicUrl(campaign.image)
                  : "";

                return (
                  <Grid.Cell columnSpan={{ xs: 6, md: 4 }} key={campaign.id}>
                    <MediaCard
                      portrait
                      title={campaign.title}
                      description=""
                      primaryAction={{
                        content: "Manage",
                        onAction: () => {
                          console.log(
                            `https://${subdomain}.atelier.sale/campaign/${campaign.handle}`
                          );
                        },
                      }}
                      secondaryAction={{
                        content: "Preview",
                        onAction: () => {
                          router.push("/campaign/home");
                        },
                      }}
                    >
                      <div className="relative w-full h-[16rem] bg-gray-200 shadow-inner">
                        {image && (
                          <img
                            src={image.data.publicUrl}
                            className="w-full h-full object-cover"
                          />
                        )}

                        <div className="absolute top-4 right-4">
                          {campaign.isActive ? (
                            <Badge status="success" progress="complete">
                              Active
                            </Badge>
                          ) : (
                            <Badge progress="incomplete">Draft</Badge>
                          )}
                        </div>
                      </div>
                    </MediaCard>
                  </Grid.Cell>
                );
              })}
            </Grid>

            <Card padding="0">
              <ResourceList
                emptyState={
                  <EmptyState
                    heading="Setup your first campaign"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    action={{
                      content: "Create campaign",
                      onAction: () => {
                        router.push("/campaign/new");
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
                    onClick={() => router.push("/campaign/new")}
                    size="slim"
                    plain
                  >
                    Add campaign
                  </Button>
                }
                selectable
                items={campaigns}
                renderItem={(resource) => {
                  const campaign = resource as campaigns;
                  const image = campaign.image
                    ? supabaseStorage.getPublicUrl(campaign.image)
                    : "";

                  return (
                    <ResourceItem
                      id={campaign.id}
                      url={`/campaign/${campaign.id}`}
                      media={
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-md bg-gray-200 overflow-hidden">
                          {image && (
                            <img
                              src={image.data.publicUrl}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      }
                    >
                      <div className="flex flex-col justify-center items-start h-full">
                        <div className="flex justify-between items-center w-full">
                          <Text as="h4" variant="headingMd" fontWeight="bold">
                            {campaign.title}
                          </Text>

                          {campaign.isActive ? (
                            <Badge status="success" progress="complete">
                              Active
                            </Badge>
                          ) : (
                            <Badge progress="incomplete">Draft</Badge>
                          )}
                        </div>

                        <Text as="p">
                          https://{subdomain}.atelier.sale/campaign/
                          {campaign.handle}
                        </Text>
                      </div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </VerticalStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;
