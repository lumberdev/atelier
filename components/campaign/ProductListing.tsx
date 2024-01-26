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
  EmptyState,
  Icon,
} from "@shopify/polaris";
import { FC } from "react";
import { ExternalIcon } from "@shopify/polaris-icons";

const ProductListing: FC<{
  totalProductCount: number;
  products: CampaignProduct[];
  manageProductsUrl: string;
  collectionUrl: string;
  pagination: {
    hasPrevious: boolean;
    onPrevious: () => void;
    hasNext: boolean;
    onNext: () => void;
  };
}> = ({
  totalProductCount,
  products,
  manageProductsUrl,
  collectionUrl,
  pagination: {
    hasNext,
    hasPrevious,
    onPrevious = () => {},
    onNext = () => {},
  },
}) => {
  const {
    settings: { shop },
  } = useStoreSettings();

  return (
    <Card padding="0">
      <BlockStack gap="400">
        <div className="px-5 py-6">
          <InlineStack align="space-between">
            <Text as="h2" variant="headingMd">
              Product Listing
            </Text>

            <div className="flex-1">
              {totalProductCount > 0 && (
                <InlineStack gap="400" align="end">
                  <Link target="_blank" url={manageProductsUrl}>
                    Manage {totalProductCount} products
                  </Link>
                </InlineStack>
              )}
            </div>
          </InlineStack>
        </div>

        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={products.length}
          condensed
          headings={[{ title: "Title" }]}
          pagination={{
            hasNext,
            hasPrevious,
            onNext,
            onPrevious,
          }}
          emptyState={
            <EmptyState
              image=""
              heading="Collection is empty"
              action={{
                content: "Manage Collection",
                external: true,
                url: collectionUrl,
                icon: ExternalIcon,
              }}
            >
              You have not yet assigned any products to this collection
            </EmptyState>
          }
        >
          {products.map((product, index) => (
            <IndexTable.Row id={product.id} position={index} key={product.id}>
              <div className="px-5 py-4">
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
