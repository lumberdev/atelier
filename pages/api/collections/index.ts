import { gql } from "graphql-request";
import { Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import sessionHandler from "@/utils/sessionHandler.js";

const router = createRouter<
  NextApiRequest & { user_session: Session },
  NextApiResponse
>();

const getCollectionsQuery = (collectionIds) => gql`
  query {
    ${collectionIds
      .map(
        (id, index) => `
      collection${index + 1}: node(id: "${id.replace(/gid:\/+/g, "gid://")}") {
        ... on Collection {          
          id
          title
          handle
          products(first: 50) {
            edges {
              node {
                id
              }
            }
          }
        }
      }`
      )
      .join("\n")}
  }
`;

const getProductsQuery = (productIds) => gql`
  query Products {
    ${productIds
      .map(
        (id, index) => `
        product${index + 1}: node(id: "${id}") {
          ... on Product {
            id
            title
            updatedAt
            handle
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }`
      )
      .join("\n")}
  }
`;

const getOptions = (accessToken, QUERY) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query: QUERY,
    }),
  };
};

interface ProductNode {
  node: {
    id: string;
    handle: string;
    title: string;
    updatedAt: string;
    featuredImage: Object;
    priceRangeV2: Object;
  };
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: ProductNode[];
  };
}

router.get(async (req, res) => {
  const storeId = req.query.store_id as string;
  const collectionIdsString = req.query.collection_ids as string;
  const collectionIds = collectionIdsString.split(",");

  const shopifyStore = "river-theme";
  const shopifyStoreUrl = `https://${shopifyStore}.myshopify.com/admin/api/2023-04/graphql.json`;

  const session = await sessionHandler.loadSession(`offline_${storeId}`);
  const accessToken = session.accessToken;

  try {
    const collectionsOptions = getOptions(
      accessToken,
      getCollectionsQuery(collectionIds)
    );
    const collectionsRaw = await fetch(
      shopifyStoreUrl,
      collectionsOptions
    ).then((response) => response.json());
    const collections: Collection[] = Object.values(collectionsRaw.data);

    const collectionProductIds = collections.flatMap((collection) =>
      collection.products.edges.map((product) => product.node.id)
    );
    const productsOptions = getOptions(
      accessToken,
      getProductsQuery(collectionProductIds)
    );
    const productsRaw = await fetch(shopifyStoreUrl, productsOptions).then(
      (response) => response.json()
    );
    const productsMap = Object.keys(productsRaw.data).reduce(
      (map, productKey) => {
        const product = productsRaw.data[productKey];
        map.set(product.id, product);
        return map;
      },
      new Map()
    );
    const collectionsWithProducts = collections.map((collection) => {
      return {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        products: collection.products.edges.map((product) => {
          return productsMap.get(product.node.id);
        }),
      };
    });
    res.status(200).json({ collections: collectionsWithProducts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
});

export default router.handler();
