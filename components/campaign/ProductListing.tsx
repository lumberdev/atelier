import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { CampaignProduct } from "@/lib/types";
import {
  Badge,
  Card,
  HorizontalStack,
  IndexTable,
  Link,
  Text,
  Thumbnail,
  VerticalStack,
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
      <VerticalStack gap="4">
        <HorizontalStack align="space-between">
          <Text as="h2" variant="headingMd">
            Product Listing
          </Text>

          <div className="flex-1">
            <HorizontalStack gap="4" align="end">
              <Link target="_blank" url={manageProductsUrl}>
                Manage {totalProductCount} products
              </Link>
            </HorizontalStack>
          </div>
        </HorizontalStack>

        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={products.length}
          condensed
          headings={[{ title: "Title" }]}
        >
          {products.map((product, index) => (
            <IndexTable.Row id={product.id} position={index} key={product.id}>
              <div className="py-4">
                <HorizontalStack gap="4" blockAlign="start">
                  <Thumbnail
                    source={product.featuredImage.url}
                    size="medium"
                    alt={product.featuredImage.altText}
                  />

                  <div className="flex-1">
                    <VerticalStack gap="2">
                      <HorizontalStack align="space-between">
                        <Text as="h3" variant="headingMd">
                          {product.title}
                        </Text>

                        <Text as="p" variant="bodyLg">
                          ${product.priceRangeV2.maxVariantPrice.amount}
                        </Text>
                      </HorizontalStack>

                      <Text as="p">{product.description}</Text>

                      <div>
                        <Badge
                          status={
                            product.publishedOnPublication ? "success" : "new"
                          }
                        >
                          {product.publishedOnPublication
                            ? "Published"
                            : "Not Published"}
                        </Badge>
                      </div>
                    </VerticalStack>
                  </div>
                </HorizontalStack>
              </div>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </VerticalStack>
    </Card>
  );
};

export default ProductListing;
