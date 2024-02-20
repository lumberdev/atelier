import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";

const getStorefrontAccessToken = async ({
  client,
}: {
  client: GraphqlClient;
}) => {
  const response = await client.query<{
    data: {
      shop: {
        storefrontAccessTokens: {
          nodes: {
            id: string;
            accessToken: string;
          }[];
        };
      };
    };
  }>({
    data: `
      query ShopStorefrontAccessToken {
        shop {
          storefrontAccessTokens(first: 1) {
            nodes {
              id
              accessToken
            }
          }
        }
      }
    `,
  });

  const [token] = response.body.data.shop.storefrontAccessTokens?.nodes ?? [];

  return token.accessToken;
};

export default getStorefrontAccessToken;
