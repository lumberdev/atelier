import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";

const getProductDetails = async ({
  handle,
  client,
  publicationId,
}: {
  handle: string;
  client: GraphqlClient;
  publicationId: string;
}) => {
  const response = await client.query<{
    data: {
      productByHandle: {
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
        hasOnlyDefaultVariant: boolean;
        mediaCount: number;
        options: {
          id: string;
          name: string;
          values: string[];
        }[];
        totalVariants: number;
        images: {
          nodes: {
            id: string;
            altText: string;
            width: number;
            height: number;
            url: string;
          }[];
        };
        variants: {
          nodes: {
            id: string;
            sku: string;
            title: string;
            image: {
              altText: string;
              width: string;
              height: string;
              url: string;
            };
            displayName: string;
            compareAtPrice: string;
            price: string;
            selectedOptions: {
              name: string;
              value: string;
            }[];
            inventoryQuantity: number;
          }[];
        };
      };
    };
  }>({
    data: `
      query ProductDetails {
        productByHandle(handle: "${handle}") {
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
          hasOnlyDefaultVariant
          mediaCount
          options(first: 50) {
            id
            name
            values
          }
          totalVariants
          images(first: 50) {
            nodes {
              id
              altText
              width
              height
              url
            }
          }
          variants(first: 50) {
            nodes {
              id
              sku
              title
              image {
                altText
                width
                height
                url
              }
              displayName
              compareAtPrice
              price
              selectedOptions {
                name
                value
              }
              inventoryQuantity
            }
          }
        }
      }
    `,
  });

  return response.body?.data?.productByHandle;
};

export default getProductDetails;
