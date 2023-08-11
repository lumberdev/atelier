import { useCampaignForm } from "@/lib/hooks/useCampaignForm";
import { CollectionResourceItem, ProductResourceItem } from "@/lib/types";
import { campaigns } from "@prisma/client";
import { ContextualSaveBar, ResourcePicker } from "@shopify/app-bridge-react";
import {
  ActionVerb,
  Collection,
  Product,
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
  Frame,
  HorizontalGrid,
  HorizontalStack,
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
import { FC, useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const CampaignForm: FC<{
  campaign?: campaigns;
  resources?: CollectionResourceItem[] | ProductResourceItem[];
}> = ({ campaign, resources }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(() => {
    if (!campaign) return 0;

    return campaign.resourceType === "COLLECTIONS" ? 0 : 1;
  });
  const [isResourcePickerOpen, setIsResourcePickerOpen] =
    useState<boolean>(false);
  const [selectedCollections, setSelectedCollections] = useState<
    CollectionResourceItem[]
  >(() => {
    if (!campaign || campaign.resourceType === "PRODUCTS" || !resources)
      return [];

    return resources as CollectionResourceItem[];
  });
  const [selectedProducts, setSelectedProducts] = useState<
    ProductResourceItem[]
  >(() => {
    if (!campaign || campaign.resourceType === "COLLECTIONS") return [];

    return resources as ProductResourceItem[];
  });
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const {
    isLoading,
    imageUrl,
    imageFile,
    formState,
    onSubmit,
    setValue,
    setImageFile,
    watch,
    reset,
    control,
  } = useCampaignForm(campaign);

  const isActive = watch("isActive");
  const isActiveSelectValue = isActive ? "true" : "false";

  useEffect(() => {
    setValue("resourceType", selectedTab === 0 ? "COLLECTIONS" : "PRODUCTS");
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab !== 0) return;

    setValue(
      "resourceIds",
      selectedCollections.map((resource) => resource.id)
    );
    setValue("variantIds", []);
  }, [selectedTab, selectedCollections]);

  useEffect(() => {
    if (selectedTab !== 1) return;

    setValue(
      "resourceIds",
      selectedProducts.map((resource) => resource.id)
    );

    const variants = selectedProducts
      .map((resource) =>
        (resource as ProductResourceItem).variants.map((v) => v.id)
      )
      .flat();

    setValue("variantIds", variants);
  }, [selectedTab, selectedProducts]);

  return (
    <Frame>
      <ContextualSaveBar
        visible={formState.isDirty}
        saveAction={{
          disabled: !formState.isValid,
          onAction: onSubmit,
          loading: isLoading,
        }}
        discardAction={{
          onAction: () => {
            reset();
            router.back();
          },
        }}
      />
      <Form onSubmit={onSubmit}>
        <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
          <VerticalStack gap="4">
            <Card roundedAbove="sm">
              <FormLayout>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextField
                      label="Title"
                      autoComplete="off"
                      autoFocus
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="handle"
                  render={({ field }) => (
                    <TextField label="Handle" autoComplete="off" {...field} />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextField
                      multiline={4}
                      label="Description"
                      autoComplete="off"
                      {...field}
                    />
                  )}
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
                          const collection = resource as CollectionResourceItem;

                          return (
                            <ResourceItem
                              id={collection.id}
                              url={collection.handle}
                              media={
                                <div className="w-12 h-12 bg-gray-200">
                                  {collection.image && (
                                    <img
                                      className="block w-full h-full rounded-full object-cover"
                                      src={collection.image.src}
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
                          const collections: CollectionResourceItem[] =
                            selection.selection.map((r) => {
                              const resource = r as Collection;

                              return {
                                id: resource.id,
                                handle: resource.handle,
                                title: resource.title,
                                image: resource.image
                                  ? { src: resource.image.originalSrc }
                                  : null,
                                productsCount: resource.productsCount,
                              };
                            });

                          setSelectedCollections(collections);
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
                          const product = resource as ProductResourceItem;

                          return (
                            <ResourceItem
                              id={product.id}
                              url={product.handle}
                              media={
                                <div className="w-12 h-12 bg-gray-200">
                                  {!!product.images?.length && (
                                    <img
                                      className="block w-full h-full rounded-full object-cover"
                                      src={product.images[0].src}
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
                          variants: (p as ProductResourceItem).variants.map(
                            (v) => ({
                              id: v.id,
                            })
                          ),
                        }))}
                        onSelection={(selection) => {
                          const products: ProductResourceItem[] =
                            selection.selection.map((r) => {
                              const resource = r as Product;

                              return {
                                id: resource.id,
                                handle: resource.handle,
                                title: resource.title,
                                images: resource.images.map((i) => ({
                                  src: i.originalSrc,
                                })),
                                variants: resource.variants.map((v) => ({
                                  id: v.id,
                                })),
                              };
                            });

                          setSelectedProducts(products);
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
                    { label: "Active", value: "true" },
                    { label: "Draft", value: "false" },
                  ]}
                  value={isActiveSelectValue}
                  onChange={(value) => setValue("isActive", value === "true")}
                />
              </VerticalStack>
            </Card>

            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <HorizontalStack align="space-between">
                  <Text variant="headingSm" as="h3">
                    Image
                  </Text>

                  {imageFile && (
                    <Button
                      destructive
                      plain
                      onClick={() => setImageFile(null)}
                    >
                      Remove
                    </Button>
                  )}
                </HorizontalStack>

                <DropZone
                  accept="image/*"
                  type="image"
                  allowMultiple={false}
                  onDrop={(
                    _dropFiles: File[],
                    acceptedFiles: File[],
                    _rejectedFiles: File[]
                  ) => setImageFile(acceptedFiles[0])}
                >
                  {imageUrl && (
                    <HorizontalStack>
                      <img
                        src={imageUrl}
                        alt=""
                        loading="eager"
                        className="w-full aspect-auto h-auto rounded-lg"
                      />
                    </HorizontalStack>
                  )}

                  {!imageFile && <DropZone.FileUpload />}
                </DropZone>
              </VerticalStack>
            </Card>
          </VerticalStack>
        </HorizontalGrid>
      </Form>
    </Frame>
  );
};

export default CampaignForm;
