import { useStoreSettings } from "@/lib/hooks/useStoreSettings";
import { useStoreThemeForm } from "@/lib/hooks/useStoreThemeForm";
import { useToast } from "@/lib/hooks/useToast";
import {
  Button,
  Card,
  DropZone,
  Form,
  FormLayout,
  HorizontalGrid,
  HorizontalStack,
  Layout,
  Page,
  Text,
  TextField,
  Toast,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const SettingsPage = () => {
  const { toasts, triggerToast, dismissToast } = useToast();
  const { errors, settings, updateStoreDomain, isUpdatingStoreDomain } =
    useStoreSettings();

  const {
    logoUrl,
    imageFile,
    setImageFile,
    onSubmit: onSubmitTheme,
    control,
    isLoading,
  } = useStoreThemeForm({
    onUpsert: () => triggerToast("Store theme updated"),
  });

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
        },
      }
    );
  });

  useEffect(() => {
    if (!settings.domain) return;

    setValue("domain", settings.domain);
  }, [settings]);

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
                      primary
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
          title="Store Branding"
          description="Add global theme settings"
        >
          <Card>
            <Form onSubmit={onSubmitTheme}>
              <FormLayout>
                <HorizontalStack align="space-between">
                  <Text variant="headingSm" as="h3">
                    Logo
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
                  {logoUrl && (
                    <HorizontalStack>
                      <img
                        src={logoUrl}
                        alt=""
                        loading="eager"
                        className="aspect-auto h-auto w-full rounded-lg"
                      />
                    </HorizontalStack>
                  )}

                  {!imageFile && <DropZone.FileUpload />}
                </DropZone>

                <HorizontalGrid columns={2} gap={{ sm: "4" }}>
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
                </HorizontalGrid>

                <HorizontalGrid columns={2} gap={{ sm: "4" }}>
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
                </HorizontalGrid>

                <HorizontalGrid columns={2} gap={{ sm: "4" }}>
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
                </HorizontalGrid>

                <HorizontalGrid alignItems="center">
                  <Button primary submit loading={isLoading}>
                    Save
                  </Button>
                </HorizontalGrid>
              </FormLayout>
            </Form>
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
    </Page>
  );
};

export default SettingsPage;
