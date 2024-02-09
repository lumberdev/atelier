import clientProvider from "@/utils/clientProvider";

const getProductDetails = async ({
  shop,
  handle,
  publicationId,
}: {
  shop: string;
  handle: string;
  publicationId: string;
}) => {
  const { client } = await clientProvider.offline.graphqlClient({ shop });

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
        compareAtPriceRange: {
          maxVariantCompareAtPrice: {
            amount: string;
            currencyCode: string;
          };
          minVariantCompareAtPrice: {
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
          compareAtPriceRange {
            maxVariantCompareAtPrice {
              amount
              currencyCode
            }
            minVariantCompareAtPrice {
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

  console.log(
    "[at]",
    JSON.stringify(response.body.data.productByHandle, null, 2)
  );

  return response.body?.data?.productByHandle;
};

export default getProductDetails;
