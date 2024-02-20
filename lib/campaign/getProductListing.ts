import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";

const getProductListing = async ({
  handle,
  client,
  publicationId,
  pagination: { productsPerPage = 50, afterCursor, beforeCursor },
}: {
  handle: string;
  client: GraphqlClient;
  publicationId: string;
  pagination: {
    productsPerPage?: number;
    afterCursor?: string;
    beforeCursor?: string;
  };
}) => {
  const paginationQuery = {
    forward: afterCursor
      ? `first: ${productsPerPage}, after: "${afterCursor}"`
      : `first: ${productsPerPage}`,
    backward: `last: ${productsPerPage}, before: "${beforeCursor}"`,
  };

  const response = await client.query<{
    data: {
      collectionByHandle: {
        products: {
          pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor?: string;
            endCursor?: string;
          };

          nodes: {
            id: string;
            title?: string;
            handle: string;
            featuredImage?: {
              altText: string;
              width: number;
              height: number;
              url: string;
            };
            description?: string;
            descriptionHtml?: string;
            publishedOnPublication: boolean;
            priceRangeV2: {
              maxVariantPrice: {
                amount: string;
                currencyCode: string;
              };
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
          }[];
        };
      };
    };
  }>({
    data: `
      query CampaignProductListing {
        collectionByHandle(handle: "${handle}") {
          products(${
            beforeCursor ? paginationQuery.backward : paginationQuery.forward
          }) {
            pageInfo {
              hasPreviousPage
              hasNextPage
              startCursor
              endCursor
            }

            nodes {
              id
              title
              handle
              featuredImage {
                altText
                width
                height
                url
              }
              description(truncateAt: 60)
              descriptionHtml
              publishedOnPublication(publicationId: "${publicationId}")
              priceRangeV2 {
                maxVariantPrice {
                  amount
                  currencyCode
                }

                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
  });

  const collection = response.body?.data?.collectionByHandle;
  const filteredProducts = collection.products.nodes.filter(
    (product) => product.publishedOnPublication
  );

  return {
    ...collection,
    products: { ...collection.products, nodes: filteredProducts },
  };
};

export default getProductListing;
