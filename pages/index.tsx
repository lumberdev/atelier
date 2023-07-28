import { useCampaigns } from "@/lib/hooks/useCampaigns";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  CalloutCard,
  EmptyState,
  Icon,
  Layout,
  LegacyCard,
  Loading,
  Page,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { AddMajor } from "@shopify/polaris-icons";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = () => {
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const { identifier, campaigns, isLoading } = useCampaigns();

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

        {!campaigns.length && (
          <Layout.Section fullWidth>
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
                A campaign is the foundation of Atelier, you can create as many
                campaigns as you want, each getting its own url, product listing
                and theme.
              </p>
            </EmptyState>
          </Layout.Section>
        )}

        <Layout.Section fullWidth>
          <LegacyCard
            title="Debug Cards"
            sectioned
            primaryFooterAction={{
              content: "Debug Cards",
              onAction: () => {
                router.push("/debug");
              },
            }}
          >
            <p>
              Explore how the repository handles data fetching from the backend,
              App Proxy, making GraphQL requests, Billing API and more.
            </p>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section oneHalf>
          <LegacyCard
            sectioned
            title="Documentation"
            primaryFooterAction={{
              content: "Explore APIs",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/graphiql/admin-graphiql",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Design Guidelines",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://shopify.dev/apps/design-guidelines",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>
              Explore the GraphQL APIs in Graphiql or read design guidelines.
            </p>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section fullWidth>
          <LegacyCard
            sectioned
            title="Developer Notes"
            primaryFooterAction={{
              content: "Read More",
              onAction: () => {
                router.push("/debug/devNotes");
              },
            }}
          >
            <p>
              Read notes on opening an issue, creating App Extensions and more.
            </p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;
