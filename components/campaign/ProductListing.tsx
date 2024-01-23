import { Card, Text, VerticalStack } from "@shopify/polaris";

const ProductListing = () => {
  return (
    <Card>
      <VerticalStack gap="4">
        <Text as="h2" variant="headingMd">
          Product Listing
        </Text>
      </VerticalStack>
    </Card>
  );
};

export default ProductListing;
