import { useCampaigns } from "@/lib/hooks/useCampaigns";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  CalloutCard,
  Card,
  Divider,
  EmptyState,
  Frame,
  Grid,
  Icon,
  Layout,
  LegacyCard,
  Loading,
  MediaCard,
  Page,
  SkeletonPage,
  SkeletonThumbnail,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { AddMajor } from "@shopify/polaris-icons";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = (props) => {
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
                url: "/app/settings",
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
            title="Repository"
            primaryFooterAction={{
              content: "GitHub",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://github.com/kinngh/shopify-nextjs-prisma-app",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Open Issue",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://github.com/kinngh/shopify-nextjs-prisma-app/issues?q=is%3Aissue",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>Star the repository, open a new issue or start a discussion.</p>
          </LegacyCard>
          <LegacyCard
            sectioned
            title="Changelog"
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/changelog/",
                  newContext: true,
                });
              },
            }}
          >
            <p>Explore changelog on Shopify.dev and follow updates.</p>
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
          <LegacyCard
            sectioned
            title="Hiring?"
            primaryFooterAction={{
              content: "Twitter",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://www.twitter.com/kinngh",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "LinkedIn",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://www.linkedin.com/in/theharshdeep/",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>🌎 / 🇨🇦 and looking to expand your engineering team?</p>
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
