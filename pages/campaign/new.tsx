import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  ActionVerb,
  Collection,
  Product,
  ResourceSelection,
} from "@shopify/app-bridge/actions/ResourcePicker";
import {
  Box,
  Button,
  Card,
  Divider,
  DropZone,
  EmptyState,
  Form,
  FormLayout,
  HorizontalGrid,
  HorizontalStack,
  Page,
  ResourceItem,
  ResourceList,
  ResourceListProps,
  Select,
  Tabs,
  Text,
  TextField,
  VerticalStack,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";

const NewCampaignPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isResourcePickerOpen, setIsResourcePickerOpen] =
    useState<boolean>(false);
  const [selectedCollections, setSelectedCollections] = useState<
    ResourceSelection[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<ResourceSelection[]>(
    []
  );
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const onSubmit = () => {};
  const handleDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => setFile(acceptedFiles[0]);

  return (
    <Page
      title="Add Campaign"
      backAction={{
        content: "Campaigns",
        onAction: () => {
          router.back();
        },
      }}
    >
      <Form onSubmit={onSubmit}>
        <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
          <VerticalStack gap="4">
            <Card roundedAbove="sm">
              <FormLayout>
                <TextField
                  label="Title"
                  autoComplete="off"
                  autoFocus
                  name="title"
                />

                <TextField
                  label="Handle"
                  autoComplete="off"
                  autoFocus
                  name="handle"
                />

                <TextField
                  multiline={4}
                  label="Description"
                  autoComplete="off"
                  autoFocus
                  name="description"
                />
              </FormLayout>
            </Card>

            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <HorizontalStack>
                  <Text variant="headingSm" as="h3">
                    Product Listing
                  </Text>
                </HorizontalStack>

                <Text as="p">
                  Select the products available for this campaign, choose from
                  collections or individual products.
                </Text>

                <Divider />

                <Tabs
                  tabs={[
                    {
                      id: "collection-resource",
                      content: "Collections",
                      accessibilityLabel: "Collection",
                      panelID: "collection-resource",
                    },
                    {
                      id: "product-resource",
                      content: "Products",
                      accessibilityLabel: "Products",
                      panelID: "product-resource",
                    },
                  ]}
                  selected={selectedTab}
                  onSelect={(tab) => setSelectedTab(tab)}
                  fitted
                >
                  {selectedTab === 0 && (
                    <VerticalStack gap="4">
                      <Box />

                      <ResourceList
                        emptyState={
                          <EmptyState
                            heading="Select product collections"
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            action={{
                              content: "Select collections",
                              onAction: () => {
                                setIsResourcePickerOpen(true);
                              },
                            }}
                          >
                            <p>
                              We'll source the products to show on your campaign
                              page from these collections.
                            </p>
                          </EmptyState>
                        }
                        alternateTool={
                          <Button
                            onClick={() => setIsResourcePickerOpen(true)}
                            size="slim"
                            plain
                          >
                            Add collection
                          </Button>
                        }
                        selectable
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        items={selectedCollections}
                        promotedBulkActions={[
                          {
                            content: "Remove",
                            onAction: () => {
                              const filteredCollections =
                                selectedCollections.filter(
                                  (c) => !selectedItems.includes(c.id)
                                );

                              setSelectedCollections(filteredCollections);
                              setSelectedItems([]);
                            },
                          },
                        ]}
                        renderItem={(resource) => {
                          const collection = resource as Collection;

                          return (
                            <ResourceItem
                              id={collection.id}
                              url={collection.handle}
                              media={
                                <div className="w-12 h-12 bg-gray-200">
                                  {collection.image && (
                                    <img
                                      className="block w-full h-full rounded-full object-cover"
                                      src={collection.image.originalSrc}
                                    />
                                  )}
                                </div>
                              }
                            >
                              <Text
                                as="h4"
                                variant="headingSm"
                                fontWeight="bold"
                              >
                                {collection.title}
                              </Text>

                              <Text as="p">
                                {collection.productsCount} products
                              </Text>
                            </ResourceItem>
                          );
                        }}
                      />

                      <ResourcePicker
                        resourceType="Collection"
                        open={isResourcePickerOpen}
                        selectMultiple
                        actionVerb={ActionVerb.Select}
                        onCancel={() => setIsResourcePickerOpen(false)}
                        initialSelectionIds={selectedCollections.map((r) => ({
                          id: r.id,
                        }))}
                        onSelection={(selection) => {
                          setSelectedCollections(selection.selection);
                          setIsResourcePickerOpen(false);
                        }}
                      />
                    </VerticalStack>
                  )}

                  {selectedTab === 1 && (
                    <VerticalStack gap="4">
                      <ResourceList
                        emptyState={
                          <EmptyState
                            heading="Select products"
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            action={{
                              content: "Select products",
                              onAction: () => {
                                setIsResourcePickerOpen(true);
                              },
                            }}
                          >
                            <p>
                              These products will be available for purchase on
                              your campaign page.
                            </p>
                          </EmptyState>
                        }
                        alternateTool={
                          <Button
                            onClick={() => setIsResourcePickerOpen(true)}
                            size="slim"
                            plain
                          >
                            Add products
                          </Button>
                        }
                        selectable
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        items={selectedProducts}
                        renderItem={(resource) => {
                          const product = resource as Product;

                          return (
                            <ResourceItem
                              id={product.id}
                              url={product.handle}
                              media={
                                <div className="w-12 h-12 bg-gray-200">
                                  {!!product.images?.length && (
                                    <img
                                      className="block w-full h-full rounded-full object-cover"
                                      src={product.images[0].originalSrc}
                                    />
                                  )}
                                </div>
                              }
                            >
                              <Text
                                as="h4"
                                variant="headingSm"
                                fontWeight="bold"
                              >
                                {product.title}
                              </Text>

                              <Text as="p">
                                {product.variants.length} variant
                                {product.variants.length > 1 ? "s" : ""}
                              </Text>
                            </ResourceItem>
                          );
                        }}
                        promotedBulkActions={[
                          {
                            content: "Remove",
                            onAction: () => {
                              const filteredProducts = selectedProducts.filter(
                                (c) => !selectedItems.includes(c.id)
                              );

                              setSelectedProducts(filteredProducts);
                              setSelectedItems([]);
                            },
                          },
                        ]}
                      />

                      <ResourcePicker
                        resourceType="Product"
                        open={isResourcePickerOpen}
                        selectMultiple
                        actionVerb={ActionVerb.Select}
                        onCancel={() => setIsResourcePickerOpen(false)}
                        initialSelectionIds={selectedProducts.map((p) => ({
                          id: p.id,
                          variants: (p as Product).variants.map((v) => ({
                            id: v.id,
                          })),
                        }))}
                        onSelection={(selection) => {
                          setSelectedProducts(selection.selection);
                          setIsResourcePickerOpen(false);
                        }}
                      />
                    </VerticalStack>
                  )}
                </Tabs>
              </VerticalStack>
            </Card>
          </VerticalStack>

          <VerticalStack gap={{ xs: "4", md: "2" }}>
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <Text as="h3" variant="headingSm">
                  Status
                </Text>

                <Select
                  label=""
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Draft", value: "draft" },
                  ]}
                />
              </VerticalStack>
            </Card>

            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <HorizontalStack align="space-between">
                  <Text variant="headingSm" as="h3">
                    Image
                  </Text>

                  {file && (
                    <Button destructive plain onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  )}
                </HorizontalStack>

                <DropZone
                  accept="image/*"
                  type="image"
                  allowMultiple={false}
                  onDrop={handleDrop}
                >
                  {file && (
                    <HorizontalStack>
                      <img
                        src={window.URL.createObjectURL(file)}
                        alt=""
                        loading="eager"
                        className="w-full aspect-auto h-auto rounded-lg"
                      />
                    </HorizontalStack>
                  )}

                  {!file && <DropZone.FileUpload />}
                </DropZone>
              </VerticalStack>
            </Card>
          </VerticalStack>
        </HorizontalGrid>
      </Form>
    </Page>
  );
};

export default NewCampaignPage;
