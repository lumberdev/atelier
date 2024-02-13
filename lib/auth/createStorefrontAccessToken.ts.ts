import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";

const createStorefrontAccessToken = async ({
  client,
}: {
  client: GraphqlClient;
}) => {
  const response = await client.query<{
    data: {
      storefrontAccessTokenCreate: {
        storefrontAccessToken: {
          id: string;
          accessToken: string;
        };
      };
      userErrors?: { field: string; message: string }[];
    };
  }>({
    data: `
      mutation CreateStorefrontAccessToken {
        storefrontAccessTokenCreate(input: {
          title: "Atelier Storefront"
        }) {
          storefrontAccessToken {
            id
            accessToken
          }

          userErrors {
            field
            message
          }
        }
      }
    `,
  });

  return response.body.data.storefrontAccessTokenCreate?.storefrontAccessToken;
};

export default createStorefrontAccessToken;
