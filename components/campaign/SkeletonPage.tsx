import {
  Box,
  Card,
  InlineGrid,
  IndexTable,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonThumbnail,
  BlockStack,
} from "@shopify/polaris";

const CampaignSkeletonPage = () => {
  return (
    <SkeletonPage primaryAction backAction>
      <Layout>
        <Layout.Section>
          <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="800">
            {/* RIGHT PANEL */}
            <BlockStack gap="400">
              <BlockStack gap="400">
                <SkeletonBodyText />
              </BlockStack>

              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText />

                  <IndexTable
                    selectable={false}
                    headings={[
                      { title: "" },
                      { title: "" },
                      { title: "" },
                      { title: "" },
                    ]}
                    itemCount={3}
                    condensed
                  >
                    <IndexTable.Row id="1" position={0}>
                      <BlockStack gap="400">
                        <Box />

                        <SkeletonThumbnail size="small" />
                        <SkeletonDisplayText />
                        <SkeletonBodyText />

                        <Box />
                      </BlockStack>
                    </IndexTable.Row>

                    <IndexTable.Row id="1" position={0}>
                      <BlockStack gap="400">
                        <Box />

                        <SkeletonThumbnail size="small" />
                        <SkeletonDisplayText />
                        <SkeletonBodyText />

                        <Box />
                      </BlockStack>
                    </IndexTable.Row>
                  </IndexTable>
                </BlockStack>
              </Card>
            </BlockStack>

            {/* LEFT PANEL */}
            <BlockStack gap="400">
              <Card>
                <SkeletonThumbnail size="large" />
              </Card>

              <Card>
                <SkeletonBodyText />
              </Card>
            </BlockStack>
          </InlineGrid>
        </Layout.Section>

        <Layout.AnnotatedSection
          title={<SkeletonDisplayText />}
          description={<SkeletonBodyText />}
        >
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title={<SkeletonDisplayText />}
          description={<SkeletonBodyText />}
        >
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </SkeletonPage>
  );
};

export default CampaignSkeletonPage;
