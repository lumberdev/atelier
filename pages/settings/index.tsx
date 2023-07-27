import { useStoreSettings } from "@/lib/hooks/useStoreSettings";
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SettingsPage = () => {
  const { errors, settings, updateStoreDomain, isUpdatingStoreDomain } =
    useStoreSettings();
  const { handleSubmit, setValue, watch } = useForm<{
    domain: string;
  }>({ defaultValues: { domain: "" } });

  const domain = watch("domain");

  const onSubmit = handleSubmit((fields: { domain: string }) => {
    updateStoreDomain({ domain: fields.domain });
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
                    <Button primary submit loading={isUpdatingStoreDomain}>
                      Save
                    </Button>
                  }
                  helpText="This is the Atelier subdomain where your campaigns will live under."
                />
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default SettingsPage;
