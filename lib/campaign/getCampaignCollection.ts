import clientProvider from "@/utils/clientProvider";

const getCampaignCollection = async ({
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
      collectionByHandle?: {
        id: string;
        handle: string;
        publishedOnPublication: boolean;
        productsCount: number;
        title?: string;
        description?: string;
        descriptionHtml?: string;
        image?: {
          id: string;
          width: number;
          height: number;
          altText: string;
          url: string;
        };
      };
    };
  }>({
    data: `
      query CampaignCollection {
        collectionByHandle(handle: "${handle}") {
          id
          handle
          publishedOnPublication(publicationId: "${publicationId}")
          productsCount
          title
          description(truncateAt: 60)
          descriptionHtml
          image {
            id
            width
            height
            altText
            url
          }
        }
      }
    `,
  });

  const collection = response.body.data.collectionByHandle;

  return collection;
};

export default getCampaignCollection;
