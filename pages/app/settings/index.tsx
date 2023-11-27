import { useBilling } from "@/context/BillingProvider";
import { useStoreSettings } from "@/lib/hooks/app/useStoreSettings";
import { useStoreThemeForm } from "@/lib/hooks/app/useStoreThemeForm";
import { useToast } from "@/lib/hooks/app/useToast";
import {
  Button,
  Card,
  ChoiceList,
  DropZone,
  Form,
  FormLayout,
  HorizontalGrid,
  HorizontalStack,
  Layout,
  Modal,
  Page,
  Text,
  TextField,
  Toast,
  VerticalStack,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";

const SettingsPage = () => {
  const { toasts, triggerToast, dismissToast } = useToast();
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);
  const { errors, settings, updateStoreDomain, isUpdatingStoreDomain } =
    useStoreSettings();
  const router = useRouter();
  const { subscription, cancel } = useBilling();

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

                <HorizontalGrid columns={2} gap={{ sm: "4" }}>
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

        <Layout.AnnotatedSection
          id="storeSettings"
          title="Subscription"
          description="Details about your subscription plan"
        >
          <Card>
            <VerticalStack gap="4">
              <Text as="p" variant="bodyLg">
                You are currently subscribed to: <b>{subscription?.name}</b>
              </Text>

              <Text as="p">
                Your next billing cycle is on {subscription?.currentPeriodEnd}.
                You will be charged <b>${subscription?.price}</b>
              </Text>

              <HorizontalStack align="end" gap="4">
                <Button destructive onClick={cancel}>
                  Cancel
                </Button>
                {/* <Button>Upgrade</Button> */}
              </HorizontalStack>
            </VerticalStack>
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
