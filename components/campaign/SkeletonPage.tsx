import {
  Box,
  Card,
  HorizontalGrid,
  IndexTable,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonThumbnail,
  VerticalStack,
} from "@shopify/polaris";

const CampaignSkeletonPage = () => {
  return (
    <SkeletonPage primaryAction backAction>
      <Layout>
        <Layout.Section>
          <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="8">
            {/* RIGHT PANEL */}
            <VerticalStack gap="4">
              <VerticalStack gap="4">
                <SkeletonBodyText />
              </VerticalStack>

              <Card>
                <VerticalStack gap="4">
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
                      <VerticalStack gap="4">
                        <Box />

                        <SkeletonThumbnail size="small" />
                        <SkeletonDisplayText />
                        <SkeletonBodyText />

                        <Box />
                      </VerticalStack>
                    </IndexTable.Row>

                    <IndexTable.Row id="1" position={0}>
                      <VerticalStack gap="4">
                        <Box />

                        <SkeletonThumbnail size="small" />
                        <SkeletonDisplayText />
                        <SkeletonBodyText />

                        <Box />
                      </VerticalStack>
                    </IndexTable.Row>
                  </IndexTable>
                </VerticalStack>
              </Card>
            </VerticalStack>

            {/* LEFT PANEL */}
            <VerticalStack gap="4">
              <Card>
                <SkeletonThumbnail size="large" />
              </Card>

              <Card>
                <SkeletonBodyText />
              </Card>
            </VerticalStack>
          </HorizontalGrid>
        </Layout.Section>

        <Layout.AnnotatedSection
          title={<SkeletonDisplayText />}
          description={<SkeletonBodyText />}
        >
          <Card>
            <VerticalStack gap="4">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </VerticalStack>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title={<SkeletonDisplayText />}
          description={<SkeletonBodyText />}
        >
          <Card>
            <VerticalStack gap="4">
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </VerticalStack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </SkeletonPage>
  );
};

export default CampaignSkeletonPage;
