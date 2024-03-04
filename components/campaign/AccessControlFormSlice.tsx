import { useCampaignForm } from "@/lib/hooks/app/useCampaignForm";
import {
  Button,
  Card,
  Checkbox,
  ChoiceList,
  DropZone,
  Grid,
  InlineStack,
  Text,
  TextField,
  BlockStack,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import ThemeColorPicker from "@/components/ThemeColorPicker";

const CampaignAccessControlFormSlice = ({
  control,
  watch,
  imageUrl,
  imageFile,
  setImageFile,
  setDidSelectImageFile,
  isLoading,
}: {
  control: ReturnType<typeof useCampaignForm>["control"];
  watch: ReturnType<typeof useCampaignForm>["watch"];
  imageUrl: ReturnType<typeof useCampaignForm>["imageUrl"];
  imageFile: ReturnType<typeof useCampaignForm>["imageFile"];
  setImageFile: ReturnType<typeof useCampaignForm>["setImageFile"];
  setDidSelectImageFile: ReturnType<typeof useCampaignForm>["setDidSelectImageFile"];
  isLoading: boolean;
}) => {
  const [useCTA, setUseCTA] = useState<boolean>(false);

  const password = watch("acpPassword");
  const layout = watch("acpLayout");
  const ctaText = watch("acpCTAText");

  useEffect(() => {
    if (!ctaText) return;

    setUseCTA(true);
  }, [ctaText]);

  function removeImage() {
    setImageFile(null);
    setDidSelectImageFile(true);
  }

  return (
    <Card>
      <BlockStack gap="400">
        <Text as="h3" variant="headingSm">
          Access Control
        </Text>

        <Controller
          control={control}
          name="acpPassword"
          render={({ field }) => (
            <TextField label="Password" autoComplete="false" {...field} />
          )}
        />

        {!!password && (
          <>
            <Text as="h4" variant="headingSm">
              Password Page
            </Text>
            <Text as="p" variant="bodyMd">
              Configure the look and feel of your password page.
            </Text>

            <Controller
              control={control}
              name="acpPasswordPlaceholder"
              render={({ field }) => (
                <TextField
                  label="Field Placeholder"
                  helpText="This will show when the password field is empty. ie Enter Password"
                  autoComplete="false"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="acpLayout"
              render={({ field: { value, onChange, ...field } }) => (
                <ChoiceList
                  title="Page Layout"
                  choices={[
                    {
                      label: "Text Overlay",
                      value: "DEFAULT",
                      helpText: "Overlay password fields onto chosen background image or colour",
                    },
                    {
                      label: "Split Layout",
                      value: "STACKED",
                      helpText:
                        "Display an image deside password fields on chosen background colour",
                    },
                  ]}
                  selected={[value]}
                  onChange={([v]) => onChange(v)}
                  disabled={isLoading}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="acpHeadline"
              render={({ field }) => (
                <TextField
                  autoComplete="false"
                  label="Headline"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="acpBody"
              render={({ field }) => (
                <TextField
                  label="Body Text"
                  autoComplete="false"
                  disabled={isLoading}
                  {...field}
                />
              )}
            />

            <Controller 
              control={control}
              name="acpBackgroundColor"
              render={({ field: { onChange, name, value } }) => (
                <ThemeColorPicker 
                  label="Background Color"
                  helpText="Empty field will default to white color (#FFFFFF)"
                  onChangeField={onChange}
                  fieldName={name}
                  colorValue={value}
                />
              )}
            />

            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text variant="headingSm" as="h4">
                  {layout === "DEFAULT" ? "Background Image" : "Image"}
                </Text>

                {(imageFile || imageUrl) && <Button
                  variant="plain"
                  tone="critical"
                  onClick={() => removeImage()}
                >
                  Remove
                </Button>}
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
                disabled={isLoading}
              >
                {imageUrl && (
                  <InlineStack>
                    <img
                      src={imageUrl}
                      alt=""
                      loading="eager"
                      className="aspect-auto h-auto w-full rounded-lg"
                    />
                  </InlineStack>
                )}

                {!imageFile && !imageUrl && <DropZone.FileUpload />}
              </DropZone>

              {layout === "DEFAULT"
                ? "The image will lie underneath the background color."
                : ""}
            </BlockStack>

            <Checkbox
              label="Use Call to Action"
              helpText="Adds a link for taking further action"
              checked={useCTA}
              onChange={(checked) => setUseCTA(checked)}
              disabled={isLoading}
            />

            {useCTA && (
              <Grid columns={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                <Controller
                  control={control}
                  name="acpCTAText"
                  render={({ field }) => (
                    <TextField
                      label="CTA Text"
                      autoComplete="false"
                      disabled={isLoading}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="acpCTAUrl"
                  render={({ field }) => (
                    <TextField
                      label="CTA URL"
                      autoComplete="false"
                      disabled={isLoading}
                      {...field}
                    />
                  )}
                />
              </Grid>
            )}
          </>
        )}
      </BlockStack>
    </Card>
  );
};

export default CampaignAccessControlFormSlice;
