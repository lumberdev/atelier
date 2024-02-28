import { useBilling } from "@/context/BillingProvider";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { useStoreThemeForm } from "@/lib/hooks/app/useStoreThemeForm";
import { useStoreMetadataForm } from "@/lib/hooks/app/useStoreMetadataForm";
import { useToast } from "@/lib/hooks/app/useToast";
import ThemeAutocomplete from "@/components/ThemeAutocomplete";
import {
  Button,
  Card,
  ChoiceList,
  ColorPicker,
  DropZone,
  Form,
  FormLayout,
  rgbToHsb,
  hsbToHex,
  hexToRgb,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  Popover,
  Text,
  TextField,
  Toast,
  BlockStack,
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";

const SettingsPage = () => {
  const { toasts, triggerToast, dismissToast } = useToast();
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);
  const { errors, settings, updateStoreDomain, isUpdatingStoreDomain } =
    useStoreSettings();
  const router = useRouter();
  const { subscription, cancel } = useBilling();


  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });
  const handleChangeColor = (newValue) => {
    setColor(newValue);
    setColorValue(hsbToHex(color));
  };
  const handleChangeColorOnOptionSelect = (selectedValue) => {
    setColorValue(selectedValue);
  }
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const [colorValue, setColorValue] = useState<string>(
    hsbToHex({
      hue: 120,
      brightness: 1,
      saturation: 1,
    })
  );
  const activator = (
    <div
      onClick={togglePopoverActive}
      className="inline-block h-9 w-9 cursor-pointer rounded-md"
      style={{
        background: `${colorValue}`,
      }}
    ></div>
  );

  const {
    logoUrl,
    imageFile,
    setImageFile,
    onSubmit: onSubmitTheme,
    control,
    isLoading,
    merchantThemeSettings
  } = useStoreThemeForm({
    onUpsert: () => triggerToast("Store theme updated"),
  });

  const {
    faviconUrl,
    imageFile: faviconImgFile,
    setImageFile: setFaviconImgFile,
    onSubmit: onSubmitMetadata,
    isLoading: faIsLoading,
  } = useStoreMetadataForm({
    onUpsert: () => triggerToast("Store metadata updated"),
  })

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

  return (
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
                      : null
                  }
                  connectedRight={
                    <Button
                      variant="primary"
                      submit
                      loading={isUpdatingStoreDomain}
                      disabled={!domain || domain == settings.domain}
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
                  {faviconImgFile && (
                    <Button 
                      tone="critical"
                      variant="plain"
                      onClick={() => setFaviconImgFile(null)}
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

                  {!faviconImgFile && <DropZone.FileUpload />}
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

                  {imageFile && (
                    <Button
                      tone="critical"
                      variant="plain"
                      onClick={() => setImageFile(null)}
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

                  {!imageFile && <DropZone.FileUpload />}
                </DropZone>

                <InlineGrid columns={2} gap="400">
                  <Controller
                    control={control}
                    name="primaryColor"
                    render={({ field }) => (
                      <TextField
                        label="Primary Color"
                        autoComplete="false"
                        helpText="Enter a valid hex/rgb code"
                        {...field}
                      />
                    )}
                  />
                  
                  {/* <Controller 
                    control={control}
                    name="primaryColor"
                    render={({ field }) => (
                      <BlockStack gap="100">
                        <Text variant="bodyMd" as="p">
                          Primary Color
                        </Text>
                        <ThemeAutocomplete 
                          label="Primary Color"
                          optionType="color"
                          optionList={merchantThemeSettings}
                        />
                      </BlockStack>
                    )}
                  /> */}

                  <Controller
                    control={control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <TextField
                        label="Secondary Color"
                        autoComplete="false"
                        helpText="Enter a valid hex/rgb code"
                        {...field}
                      />
                    )}
                  />
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
                    <BlockStack gap="100">
                      <Text as="p">Primary Color</Text>
                      <InlineStack gap="200">
                        <Popover
                          preferredPosition="above"
                          preferredAlignment="left"
                          active={popoverActive}
                          activator={activator}
                          autofocusTarget="first-node"
                          onClose={togglePopoverActive}
                        >
                          <ColorPicker onChange={handleChangeColor} color={color} />
                        </Popover>
                        <div className="flex-1">
                          <TextField
                            label=""
                            value={colorValue}
                            onChange={(value) => {
                              setColorValue(value);
                              const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                              if (hexRegex.test(value)) {
                                setColor(rgbToHsb(hexToRgb(value)));
                              }
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </InlineStack>
                    </BlockStack>

                    <BlockStack gap="100">
                      <Text as="p"><br/></Text>
                      <ThemeAutocomplete 
                        label="Primary Color"
                        optionType="color"
                        optionList={merchantThemeSettings}
                        onChangeOption={setColorValue}
                      />
                    </BlockStack>
                    
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
                  <Controller
                    control={control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <TextField
                        label="Background Color"
                        autoComplete="false"
                        helpText="Enter a valid hex/rgb code"
                        {...field}
                      />
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
                        {...field}
                      />
                    )}
                  />
                </InlineGrid>

                <InlineGrid columns={2} gap="400">
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
                </InlineGrid>

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

