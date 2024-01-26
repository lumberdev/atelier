import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { CampaignCollection, CampaignFlatFields } from "@/lib/types";
import {
  CallbackAction,
  Card,
  EmptyState,
  Form,
  Frame,
  HorizontalGrid,
  Layout,
  LinkAction,
  Page,
  Select,
  SkeletonThumbnail,
  Text,
  Thumbnail,
  Toast,
  VerticalStack,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import { FC } from "react";
import StoreCustomizationFormSlice from "./StoreCustomizationFormSlice";
import CartCustomizationFormSlice from "./CartCustomizationFormSlice";
import ProductListing from "./ProductListing";
import { useCampaignForm } from "@/lib/hooks/app/useCampaignForm";
import { ContextualSaveBar } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";
import CampaignAccessControlFormSlice from "./AccessControlFormSlice";
import { useToast } from "@/lib/hooks/app/useToast";
import usePublication from "@/lib/hooks/app/usePublication";
import getIdFromGid from "@/utils/getIdFromGid";

const CampaignPage: FC<{
  collection: CampaignCollection;
  campaign?: CampaignFlatFields;
  backAction?: CallbackAction | LinkAction;
}> = ({ collection, campaign, backAction }) => {
  const router = useRouter();
  const {
    settings: { shop },
  } = useStoreSettings();
  const { id: publicationId } = usePublication();

  const { toasts, triggerToast, dismissToast } = useToast();
  const {
    control,
    isLoading,
    formState,
    imageUrl,
    imageFile,
    reset,
    onSubmit,
    watch,
    setImageFile,
    didSelectImageFile,
  } = useCampaignForm({
    initialValues: campaign,
    handle: collection.handle,
    collectionId: collection.id,
    onCreate: (campaign) => {
      router.push(`/app/campaign/${campaign.id}`);
    },
    onUpdate: () => {
      triggerToast("Campaign updated");
    },
  });

  const collectionUrl = `https://${shop}/admin/collections/${getIdFromGid(
    collection.id
  )}`;

  const collectionProductsUrl = `https://${shop}//admin/bulk?resource_name=Product&edit=publications.${getIdFromGid(
    publicationId
  )}.published_at&collection_id=${getIdFromGid(collection.id)}`;

  return (
    <Frame>
      <ContextualSaveBar
        visible={formState.isDirty || didSelectImageFile}
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

      <Page
        title={collection.title}
        backAction={backAction}
        secondaryActions={[
          {
            content: "Manage collection",
            external: true,
            url: collectionUrl,
          },
        ]}
      >
        <Form onSubmit={onSubmit}>
          <Layout>
            <Layout.Section>
              <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
                {/* LEFT PANEL */}
                <VerticalStack gap="4">
                  {collection.descriptionHtml ? (
                    <div
                      className="pb-8"
                      dangerouslySetInnerHTML={{
                        __html: collection.descriptionHtml,
                      }}
                    />
                  ) : (
                    <EmptyState
                      image=""
                      action={{
                        content: "Go to Collection",
                        icon: ExternalMinor,
                        external: true,
                        url: collectionUrl,
                      }}
                    >
                      <Text as="p">
                        Your campaign will use the {collection.title}&nbsp;
                        collection's details such as description and image. You
                        can configure the rest of the campaign now and update
                        the collection at any moment.
                      </Text>
                    </EmptyState>
                  )}

                  <ProductListing
                    totalProductCount={collection.productsCount}
                    products={collection.products.edges.map(({ node }) => node)}
                    manageProductsUrl={collectionProductsUrl}
                  />
                </VerticalStack>

                {/* RIGHT PANEL */}
                <VerticalStack gap="4">
                  <Card>
                    <VerticalStack gap="4">
                      <Text as="h2" variant="headingMd">
                        Status
                      </Text>

                      <Controller
                        control={control}
                        name="isActive"
                        render={({ field: { value, onChange, ...field } }) => (
                          <Select
                            label=""
                            options={[
                              { label: "Active", value: "true" },
                              { label: "Draft", value: "false" },
                            ]}
                            value={String(value)}
                            onChange={(value) => onChange(value === "true")}
                            disabled={isLoading}
                            {...field}
                          />
                        )}
                      />
                    </VerticalStack>
                  </Card>

                  <Card>
                    <VerticalStack gap="4">
                      <Text as="h2" variant="headingMd">
                        Image
                      </Text>

                      {collection.image ? (
                        <img
                          src={collection.image.url}
                          alt={collection.image.altText}
                          className="aspect-square w-full rounded-md object-cover"
                        />
                      ) : (
                        <Text as="p" variant="bodySm">
                          Configure the campaign image on the collection page
                        </Text>
                      )}
                    </VerticalStack>
                  </Card>
                </VerticalStack>
              </HorizontalGrid>

              <div className="h-8" />
            </Layout.Section>

            <Layout.AnnotatedSection
              title="Access Control"
              description="Restrict access to your campaign page. Customers will have to enter the password to access your product listing."
            >
              <CampaignAccessControlFormSlice
                control={control}
                isLoading={isLoading}
                watch={watch}
                imageUrl={imageUrl}
                imageFile={imageFile}
                setImageFile={setImageFile}
              />
            </Layout.AnnotatedSection>

            <Layout.AnnotatedSection
              title="Store Customization"
              description="Customize your campaign page"
            >
              <StoreCustomizationFormSlice
                control={control}
                isLoading={isLoading}
              />
            </Layout.AnnotatedSection>

            <Layout.AnnotatedSection
              title="Cart Customization"
              description="Customize the cart"
            >
              <CartCustomizationFormSlice
                control={control}
                isLoading={isLoading}
              />
              <div className="h-16" />
            </Layout.AnnotatedSection>
          </Layout>
        </Form>

        {toasts.map((toast, index) => (
          <Toast
            content={toast}
            onDismiss={() => dismissToast(index)}
            key={index}
          />
        ))}
      </Page>
    </Frame>
  );
};

export default CampaignPage;
