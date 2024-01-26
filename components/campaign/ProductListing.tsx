import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { CampaignProduct } from "@/lib/types";
import {
  Badge,
  Card,
  InlineStack,
  IndexTable,
  Link,
  Text,
  Thumbnail,
  BlockStack,
} from "@shopify/polaris";
import { FC } from "react";

const ProductListing: FC<{
  totalProductCount: number;
  products: CampaignProduct[];
  manageProductsUrl: string;
}> = ({ totalProductCount, products, manageProductsUrl }) => {
  const {
    settings: { shop },
  } = useStoreSettings();

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Text as="h2" variant="headingMd">
            Product Listing
          </Text>

          <div className="flex-1">
            <InlineStack gap="400" align="end">
              <Link target="_blank" url={manageProductsUrl}>
                Manage {totalProductCount} products
              </Link>
            </InlineStack>
          </div>
        </InlineStack>

        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={products.length}
          condensed
          headings={[{ title: "Title" }]}
        >
          {products.map((product, index) => (
            <IndexTable.Row id={product.id} position={index} key={product.id}>
              <div className="py-4">
                <InlineStack gap="400" blockAlign="start">
                  <Thumbnail
                    source={product.featuredImage.url}
                    size="medium"
                    alt={product.featuredImage.altText}
                  />

                  <div className="flex-1">
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">
                          {product.title}
                        </Text>

                        <Text as="p" variant="bodyLg">
                          ${product.priceRangeV2.maxVariantPrice.amount}
                        </Text>
                      </InlineStack>

                      <Text as="p">{product.description}</Text>

                      <div>
                        <Badge
                          tone={
                            product.publishedOnPublication ? "success" : "new"
                          }
                        >
                          {product.publishedOnPublication
                            ? "Published"
                            : "Not Published"}
                        </Badge>
                      </div>
                    </BlockStack>
                  </div>
                </InlineStack>
              </div>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </BlockStack>
    </Card>
  );
};

export default ProductListing;
