import clientProvider from "@/utils/clientProvider";

const getStorefrontAccessToken = async ({ shop }: { shop: string }) => {
  const { client } = await clientProvider.offline.graphqlClient({ shop });

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
