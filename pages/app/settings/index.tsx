import { useBilling } from "@/context/BillingProvider";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { useStoreThemeForm } from "@/lib/hooks/app/useStoreThemeForm";
import { useStoreMetadataForm } from "@/lib/hooks/app/useStoreMetadataForm";
import { useToast } from "@/lib/hooks/app/useToast";
import ThemeColorDropdown from "@/components/ThemeColorDropdown";
import ThemeColorPicker from "@/components/ThemeColorPicker";
import SkeletonTemplate from "@/components/SkeletonTemplate";
import {
  Button,
  Card,
  ChoiceList,
  DropZone,
  Form,
  FormLayout,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Text,
  TextField,
  Toast,
  BlockStack,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";

const SettingsPage = () => {
  const { toasts, triggerToast, dismissToast } = useToast();
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);
  const { errors, settings, updateStoreDomain, isUpdatingStoreDomain } =
    useStoreSettings();
  const [validationErrorMsg, setValidationErrorMsg] = useState(null);
  const router = useRouter();
  const { subscription, subsLoading, cancel } = useBilling();

  useEffect(() => {
    if(!subsLoading && !subscription) router.replace("/app/onboarding");
  }, [subsLoading, subscription])

  const {
    logoUrl,
    imageFile,
    setImageFile,
    setLogoUrl,
    onSubmit: onSubmitTheme,
    control,
    isLoading,
    merchantThemeSettings,
    getValues: getStoreThemeValue,
    setValue: setStoreThemeValue
  } = useStoreThemeForm({
    onUpsert: () => triggerToast("Store theme updated"),
  });

  const {
    faviconUrl,
    setFaviconUrl,
    imageFile: faviconImgFile,
    setImageFile: setFaviconImgFile,
    onSubmit: onSubmitMetadata,
    isLoading: faIsLoading,
  } = useStoreMetadataForm({
    onUpsert: () => triggerToast("Store metadata updated"),
  })

  const removeFavicon = () => {
    setFaviconImgFile(null);
    setFaviconUrl("");
  }

  const removeImage = () => {
    setImageFile(null);
    setLogoUrl("");
  }

  const { handleSubmit, setValue, watch } = useForm<{
    domain: string;
  }>({ defaultValues: { domain: "" } });

  const domain = watch("domain");

  const onSubmit = handleSubmit((fields: { domain: string }) => {
    updateStoreDomain(
      { domain: fields.domain },
      {
        onSuccess: (response) => {
          if (response.error) return;
          triggerToast("Domain updated");
          if (firstTimeSetup) setTimeout(() => router.push("/app"), 1500);
        },
      }
    );
  });

  useEffect(() => {
    if (!settings.domain) return;
    setValue("domain", settings.domain);
  }, [settings]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const initial = url.searchParams.get("initial");
    if (initial) setFirstTimeSetup(true);
  }, []);

  // validates domain name 
  useEffect(() => {
    if(domain == settings.domain) {
      setValidationErrorMsg(null);
      return;
    }

    // subdomain can contain letters, numbers, or hyphens
    // the others should be marked as invalid
    // the subdomain length should also be greater than 1
    const validationRegex = /^[a-zA-Z0-9\-]{2,}$/;

    if(validationRegex.test(domain)) {
      setValidationErrorMsg(null);
    } else {
      setValidationErrorMsg("Invalid domain name - can only contain letters, numbers, and hyphens, length being at least 2");
    }
  }, [domain])

  return subsLoading ? (
    <SkeletonTemplate />
  ) : (
    <Page title="Settings">
      <Layout>
        <Layout.AnnotatedSection
          id="storeSettings"
          title="Store details"
          description="Customize your Atelier store settings"
        >
          <Card>
            <Form onSubmit={onSubmit}>
              <FormLayout>
                <TextField
                  label="Domain"
                  value={domain}
                  onChange={(value) => setValue("domain", value)}
                  autoComplete="off"
                  error={
                    errors["UNAVAILABLE_DOMAIN"]
                      ? errors["UNAVAILABLE_DOMAIN"]
                      : validationErrorMsg
                  }
                  connectedRight={
                    <Button
                      variant="primary"
                      submit
                      loading={isUpdatingStoreDomain}
                      disabled={ domain == settings.domain || validationErrorMsg ? true : false}
                    >
                      Save
                    </Button>
                  }
                  helpText="This is the Atelier subdomain where your campaigns will live under."
                />
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          id="storeSettings"
          title="Store Metadata"
          description="Add theme metadata"
        >
          <Card>
            <Form onSubmit={onSubmitMetadata}>
              <FormLayout>
                <InlineStack align="space-between">
                  <Text variant="headingSm" as="h3">
                    Favicon
                  </Text>
                  {(faviconImgFile || faviconUrl) && (
                    <Button 
                      tone="critical"
                      variant="plain"
                      onClick={() => removeFavicon()}
                    >Remove</Button>
                  )}
                </InlineStack>
                <DropZone
                  accept="image/*"
                  type="image"
                  allowMultiple={false}
                  onDrop={(
                    _dropFiles: File[],
                    acceptedFiles: File[],
                    _rejectedFiles: File[]
                  ) => setFaviconImgFile(acceptedFiles[0])}
                >
                  {faviconUrl && (
                    <InlineStack>
                      <img
                        src={faviconUrl}
                        alt=""
                        loading="eager"
                        className="aspect-auto h-auto w-full rounded-lg"
                      />
                    </InlineStack>
                  )}

                  {!faviconImgFile && !faviconUrl && <DropZone.FileUpload />}
                </DropZone>
                <Text variant="bodySm" as="span" tone="subdued">Default favicon will be retrieved from the current merchant website.</Text>
                <InlineGrid alignItems="center">
                  <Button variant="primary" submit loading={faIsLoading}>
                    Save
                  </Button>
                </InlineGrid>
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          id="storeSettings"
          title="Store Branding"
          description="Add global theme settings"
        >
          <Card>
            <Form onSubmit={onSubmitTheme}>
              <FormLayout>
                <InlineStack align="space-between">
                  <Text variant="headingSm" as="h3">
                    Logo
                  </Text>

                  {(imageFile || logoUrl) && (
                    <Button
                      tone="critical"
                      variant="plain"
                      onClick={() => removeImage()}
                    >
                      Remove
                    </Button>
                  )}
                </InlineStack>

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
                  {logoUrl && (
                    <InlineStack>
                      <img
                        src={logoUrl}
                        alt=""
                        loading="eager"
                        className="aspect-auto h-auto w-full rounded-lg"
                      />
                    </InlineStack>
                  )}

                  {!imageFile && !logoUrl && <DropZone.FileUpload />}
                </DropZone>

                <InlineGrid columns={2} gap="400">
                  <Controller 
                    control={control}
                    name="primaryColor"
                    render={({ field: { onChange, name, value } }) => (
                      <>
                        <ThemeColorPicker 
                          label="Primary Color"
                          helpText="Enter a valid hex/rgb code"
                          fieldName={name}
                          colorValue={value}
                          onChangeField={onChange}
                        />

                        <BlockStack gap="100">
                          <Text as="p"><br/></Text>
                          <ThemeColorDropdown 
                            label="Primary Color"
                            optionList={merchantThemeSettings}
                            fieldName={name}
                            onChangeOption={onChange}
                          />
                        </BlockStack>
                      </>
                    )}
                  />
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
                  <Controller 
                    control={control}
                    name="secondaryColor"
                    render={({ field: { onChange, name, value } }) => (
                      <>
                        <ThemeColorPicker 
                          label="Secondary Color"
                          helpText="Enter a valid hex/rgb code"
                          fieldName={name}
                          colorValue={value}
                          onChangeField={onChange}
                        />

                        <BlockStack gap="100">
                          <Text as="p"><br/></Text>
                          <ThemeColorDropdown 
                            label="Secondary Color"
                            optionList={merchantThemeSettings}
                            fieldName={name}
                            onChangeOption={onChange}
                          />
                        </BlockStack>
                      </>
                    )}
                  />
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
                  <Controller 
                    control={control}
                    name="backgroundColor"
                    render={({ field: { onChange, name, value } }) => (
                      <>
                        <ThemeColorPicker 
                          label="Background and Navigation Color"
                          helpText="Enter a valid hex/rgb code"
                          fieldName={name}
                          colorValue={value}
                          onChangeField={onChange}
                        />

                        <BlockStack gap="100">
                          <Text as="p"><br/></Text>
                          <ThemeColorDropdown 
                            label="Background Color"
                            optionList={merchantThemeSettings}
                            fieldName={name}
                            onChangeOption={onChange}
                          />
                        </BlockStack>
                      </>
                    )}
                  />             
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
                  <Controller
                    control={control}
                    name="borderRadius"
                    render={({ field }) => (
                      <TextField
                        type="number"
                        label="Border Radius"
                        autoComplete="false"
                        helpText="The border radius adjusts the corner curvature of all buttons and the in-cart image"
                        {...field}
                      />
                    )}
                  />
                </InlineGrid>

                {(imageFile || logoUrl) && (<InlineGrid columns={2} gap="400">
                  {" "}
                  <Controller
                    control={control}
                    name="logoPosition"
                    render={({ field: { onChange, value } }) => (
                      <ChoiceList
                        title="Logo Position"
                        choices={[
                          { label: "Left", value: "left" },
                          { label: "Center", value: "center" },
                        ]}
                        selected={[value]}
                        onChange={([newValue]) => {
                          onChange(newValue);
                        }}
                      />
                    )}
                  />
                </InlineGrid>)}

                <InlineGrid alignItems="center">
                  <Button variant="primary" submit loading={isLoading}>
                    Save
                  </Button>
                </InlineGrid>
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          id="storeSettings"
          title="Subscription"
          description="Details about your subscription plan"
        >
          <Card>
            <BlockStack gap="400">
              <Text as="p" variant="bodyLg">
                You are currently subscribed to: <b>{subscription?.name}</b>
              </Text>

              <Text as="p">
                Your next billing cycle is on {subscription?.currentPeriodEnd}.
                You will be charged <b>${subscription?.price}</b>
              </Text>

              <InlineStack align="end" gap="400">
                <Button tone="critical" onClick={cancel}>
                  Cancel
                </Button>
                {/* <Button>Upgrade</Button> */}
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>

      {toasts.map((toast, index) => (
        <Toast
          content={toast}
          onDismiss={() => dismissToast(index)}
          key={index}
        />
      ))}
      <div className="h-16" />
    </Page>
  );
};

export default SettingsPage;

