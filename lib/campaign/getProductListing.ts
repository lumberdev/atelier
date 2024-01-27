import clientProvider from "@/utils/clientProvider";

const getProductListing = async ({
  shop,
  handle,
  publicationId,
  pagination: { productsPerPage = 50, afterCursor, beforeCursor },
}: {
  shop: string;
  handle: string;
  publicationId: string;
  pagination: {
    productsPerPage?: number;
    afterCursor?: string;
    beforeCursor?: string;
  };
}) => {
  const { client } = await clientProvider.offline.graphqlClient({ shop });

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
            featuredImage?: {
              altText: string;
              width: number;
              height: number;
              url: string;
            };
            description?: string;
            descriptionHtml?: string;
            publishedOnPublication: boolean;
          };
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
              featuredImage {
                altText
                width
                height
                url
              }
              description(truncateAt: 60)
              descriptionHtml
              publishedOnPublication(publicationId: "${publicationId}")
            }
          }
        }
      }
    `,
  });

  const collection = response.body?.data?.collectionByHandle;

  return collection;
};

export default getProductListing;
