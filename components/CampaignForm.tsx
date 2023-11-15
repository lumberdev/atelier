import { useCampaignForm } from "@/lib/hooks/app/useCampaignForm";
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
  ChoiceList,
  Divider,
  DropZone,
  EmptyState,
  Form,
  FormLayout,
  Frame,
  HorizontalGrid,
  HorizontalStack,
  Layout,
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
import { FC, useCallback, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { areArraysTheSame } from "@/lib/helper/objects";
import CampaignAccessControlFormSlice from "./campaign/AccessControlFormSlice";

const CampaignForm: FC<{
  campaign?: campaigns;
  collections?: CollectionResourceItem[];
  products?: ProductResourceItem[];
  isCreating?: boolean;
}> = ({ campaign, collections, products, isCreating = true }) => {
  const router = useRouter();
  const [nonControlledFormDirty, setNonControlledFormDirty] =
    useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
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
  } = useCampaignForm(
    campaign,
    (isDirty: boolean) => setNonControlledFormDirty(isDirty),
    (imageChanged: boolean) => setImageChanged(imageChanged)
  );

  const [cartItemImageStyle, setCartItemImageStyle] = useState<string[]>([
    formState.defaultValues.cartItemsImageStyle,
  ]);

  const handleCartItemImageStyleChange = useCallback(
    (value: string[]) => setCartItemImageStyle(value),
    []
  );

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isResourcePickerOpen, setIsResourcePickerOpen] =
    useState<boolean>(false);
  const [selectedCollections, setSelectedCollections] = useState<
    CollectionResourceItem[]
  >(() => {
    if (!campaign || !collections) return [];

    return collections as CollectionResourceItem[];
  });
  const [selectedProducts, setSelectedProducts] = useState<
    ProductResourceItem[]
  >(() => {
    if (!campaign || !products) return [];

    return products as ProductResourceItem[];
  });
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const isActive = watch("isActive");
  const isActiveSelectValue = isActive ? "true" : "false";

  useEffect(() => {
    setValue("cartItemsImageStyle", cartItemImageStyle[0]);
  }, [cartItemImageStyle]);

  useEffect(() => {
    if (selectedTab !== 0) return;

    setValue(
      "collectionIds",
      selectedCollections.map((resource) => resource.id)
    );
  }, [selectedTab, selectedCollections]);

  useEffect(() => {
    if (selectedTab !== 1) return;

    setValue(
      "productIds",
      selectedProducts.map((resource) => resource.id)
    );

    const variants = selectedProducts
      .map((resource) =>
        (resource as ProductResourceItem).variants.map((v) => v.id)
      )
      .flat();

    setValue("variantIds", variants);
  }, [selectedTab, selectedProducts]);

  const hasNonControllerInputsChanged = () => {
    const formProductIds = selectedProducts.map((resource) => resource.id);
    const defaultProductIds = [...campaign.productIds];
    const formCollectionIds = selectedCollections.map(
      (resource) => resource.id
    );
    const defaultCollectionIds = [...campaign.collectionIds];
    if (cartItemImageStyle[0] != campaign.cartItemsImageStyle) {
      return true;
    } else if (campaign.isActive != isActive) {
      return true;
    } else if (!areArraysTheSame(formProductIds, defaultProductIds)) {
      return true;
    } else if (!areArraysTheSame(formCollectionIds, defaultCollectionIds)) {
      return true;
    } else if (imageChanged) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (campaign) {
      const nonControlledInputsChanged = hasNonControllerInputsChanged();
      setNonControlledFormDirty(nonControlledInputsChanged);
    }
  }, [
    cartItemImageStyle,
    isActive,
    selectedProducts,
    selectedCollections,
    imageChanged,
    campaign,
  ]);

  const resetForm = () => {
    if (campaign)
      reset({
        id: campaign.id,
        title: campaign.title,
        handle: campaign.handle,
        description: campaign.description,
        cartTitle: campaign.cartTitle,
        cartBackgroundColor: campaign.cartBackgroundColor,
        cartTextColor: campaign.cartTextColor,
        cartItemsImageStyle: campaign.cartItemsImageStyle,
        cartDescription: campaign.cartDescription,
        isActive: campaign.isActive,
        collectionIds: campaign.collectionIds,
        productIds: campaign.productIds,
        variantIds: campaign.variantIds,
      });
  };

  useEffect(() => {
    if (campaign) resetForm();
  }, [campaign]);

  return (
    <Frame>
      <ContextualSaveBar
        visible={formState.isDirty || nonControlledFormDirty}
        saveAction={{
          disabled: !formState.isValid,
          onAction: onSubmit,
          loading: isLoading,
        }}
        discardAction={{
          onAction: () => {
            resetForm();
            router.back();
          },
        }}
      />

      <Form onSubmit={onSubmit}>
        <VerticalStack gap="12">
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
                        disabled={isLoading}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="handle"
                    render={({ field }) => (
                      <TextField
                        label="Handle"
                        autoComplete="off"
                        disabled={isLoading}
                        {...field}
                      />
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
                        disabled={isLoading}
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
                                We'll source the products to show on your
                                campaign page from these collections.
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
                            const collection =
                              resource as CollectionResourceItem;

                            return (
                              <ResourceItem
                                id={collection.id}
                                url={collection.handle}
                                media={
                                  <div className="h-12 w-12 bg-gray-200">
                                    {collection.image && (
                                      <img
                                        className="block h-full w-full rounded-full object-cover"
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
                                  <div className="h-12 w-12 bg-gray-200">
                                    {!!product.images?.length && (
                                      <img
                                        className="block h-full w-full rounded-full object-cover"
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
                                const filteredProducts =
                                  selectedProducts.filter(
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

              <Card roundedAbove="sm">
                <VerticalStack gap="4">
                  <HorizontalStack>
                    <Text variant="headingSm" as="h3">
                      Cart Customization
                    </Text>
                  </HorizontalStack>
                  <FormLayout>
                    <Controller
                      control={control}
                      name="cartTitle"
                      render={({ field }) => (
                        <TextField
                          label="Cart Title"
                          autoComplete="off"
                          autoFocus
                          disabled={isLoading}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="cartBackgroundColor"
                      render={({ field }) => (
                        <TextField
                          label="Background Color"
                          autoComplete="off"
                          autoFocus
                          disabled={isLoading}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="cartTextColor"
                      render={({ field }) => (
                        <TextField
                          label="Text Color"
                          autoComplete="off"
                          autoFocus
                          disabled={isLoading}
                          {...field}
                        />
                      )}
                    />
                    <ChoiceList
                      title="Image Style"
                      choices={[
                        { label: "Round", value: "round" },
                        { label: "Square", value: "square" },
                      ]}
                      selected={cartItemImageStyle}
                      onChange={handleCartItemImageStyleChange}
                      disabled={isLoading}
                    />

                    <Controller
                      control={control}
                      name="cartDescription"
                      render={({ field }) => (
                        <TextField
                          multiline={4}
                          label="Cart Description"
                          autoComplete="off"
                          disabled={isLoading}
                          {...field}
                        />
                      )}
                    />
                  </FormLayout>
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
                    disabled={isLoading}
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
                        onClick={() => {
                          setImageChanged(true);
                          setImageFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </HorizontalStack>

                  <DropZone
                    accept="image/*"
                    type="image"
                    allowMultiple={false}
                    disabled={isLoading}
                    onDrop={(
                      _dropFiles: File[],
                      acceptedFiles: File[],
                      _rejectedFiles: File[]
                    ) => {
                      setImageChanged(true);
                      setImageFile(acceptedFiles[0]);
                    }}
                  >
                    {imageUrl && (
                      <HorizontalStack>
                        <img
                          src={imageUrl}
                          alt=""
                          loading="eager"
                          className="aspect-auto h-auto w-full rounded-lg"
                        />
                      </HorizontalStack>
                    )}

                    {!imageFile && <DropZone.FileUpload />}
                  </DropZone>
                </VerticalStack>
              </Card>
            </VerticalStack>
          </HorizontalGrid>

          <Layout>
            {!isCreating && (
              <Layout.AnnotatedSection
                title="Access Control"
                description="Restrict access to your campaign page. Customers will have to enter the password to access your product listing."
              >
                <CampaignAccessControlFormSlice campaign={campaign} />
              </Layout.AnnotatedSection>
            )}
          </Layout>
        </VerticalStack>
      </Form>
    </Frame>
  );
};

export default CampaignForm;
