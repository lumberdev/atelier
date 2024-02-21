import { CampaignCollection } from "@/lib/types";
import clientProvider from "@/utils/clientProvider";
import verifyRequest from "@/utils/middleware/verifyRequest";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

router.use(verifyRequest);

router.get(async (req, res) => {
  const shop = req.user_session.shop;
  const {
    id,
    after: paginateAfter = "",
    before: paginateBefore = "",
  } = req.query;
  const collectionId = `gid://shopify/Collection/${id}`;

  const { client } = await clientProvider.offline.graphqlClient({ shop });

  const publicationResponse = await client.query({
    data: `
      query ShopPublication {
        currentAppInstallation {
          publication {
            id
          }
        }
      }
    `,
  });
  const publication = (publicationResponse.body as any)?.data
    .currentAppInstallation?.publication;

  const productsPerPage = 5;
  const pagination = {
    forward: paginateAfter
      ? `first: ${productsPerPage}, after: "${paginateAfter}"`
      : `first: ${productsPerPage}`,
    backward: `last: ${productsPerPage}, before: "${paginateBefore}"`,
  };

  const response = await client.query({
    data: `
      query Collection {
        collection(id: "${collectionId}") {
          id
          handle
          title
          description
          descriptionHtml
          image {
            id
            width
            height
            altText
            url
          }
          productsCount
          products(${
            paginateBefore ? pagination.backward : pagination.forward
          }) {
            pageInfo {
              hasPreviousPage
              hasNextPage
              startCursor
              endCursor
            }

            edges {
              node {
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
                priceRangeV2 {
                  minVariantPrice {
                    amount
                  }
                  maxVariantPrice {
                    amount
                  }
                }
                publishedOnPublication(publicationId: "${publication.id}")
                tags
              }
            }
          }
        }
      }
    `,
  });

  const collection: CampaignCollection = (response.body as any).data
    ?.collection;

  return res.status(200).json(collection);
});

export default router.handler();
