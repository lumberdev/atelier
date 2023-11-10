import { useCampaignAccessControlForm } from "@/lib/hooks/useCampaignAccessControlForm";
import { useToast } from "@/lib/hooks/useToast";
import { campaigns } from "@prisma/client";
import {
  Button,
  Card,
  Checkbox,
  ChoiceList,
  DropZone,
  Grid,
  HorizontalStack,
  Text,
  TextField,
  Toast,
  VerticalStack,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const CampaignAccessControlFormSlice = ({
  campaign,
}: {
  campaign: campaigns;
}) => {
  const { toasts, triggerToast, dismissToast } = useToast();
  const {
    control,
    imageUrl,
    imageFile,
    onSubmit,
    watch,
    setValue,
    setImageFile,
    formState,
  } = useCampaignAccessControlForm({
    campaign,
    onSuccess: () => triggerToast("Access control updated"),
  });
  const [useCTA, setUseCTA] = useState<boolean>(false);

  const password = watch("password");
  const layout = watch("layout");
  const ctaText = watch("ctaText");

  useEffect(() => {
    if (!ctaText) return;

    setUseCTA(true);
  }, [ctaText]);

  return (
    <Card>
      <VerticalStack gap="4">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField label="Password" autoComplete="false" {...field} />
          )}
        />

        {!!password && (
          <>
            <Text as="h4" variant="headingXs">
              Password Page
            </Text>
            <Text as="p" variant="bodyMd">
              Configure the look and feel of your password page.
            </Text>

            <ChoiceList
              title="Page Layout"
              choices={[
                {
                  label: "Background",
                  value: "DEFAULT",
                  helpText: "Use a background color or image.",
                },
                {
                  label: "Stacked Layout",
                  value: "STACKED",
                  helpText:
                    "Display an image on top of the page content on mobile and side by side on desktop.",
                },
              ]}
              selected={[layout]}
              onChange={([v]) => setValue("layout", v as "DEFAULT" | "STACKED")}
            />

            <Controller
              control={control}
              name="headline"
              render={({ field }) => (
                <TextField autoComplete="false" label="Headline" {...field} />
              )}
            />
            <Controller
              control={control}
              name="body"
              render={({ field }) => (
                <TextField label="Body Text" autoComplete="false" {...field} />
              )}
            />

            <Controller
              control={control}
              name="passwordPlaceholder"
              render={({ field }) => (
                <TextField
                  label="Field Placeholder"
                  helpText="This will show when he password field is empty. ie Enter Password"
                  autoComplete="false"
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="backgroundColor"
              render={({ field }) => (
                <TextField
                  label="Background Color"
                  autoComplete="false"
                  {...field}
                />
              )}
            />

            <VerticalStack gap="4">
              <HorizontalStack align="space-between">
                <Text variant="headingSm" as="h4">
                  {layout === "DEFAULT" ? "Background Image" : "Image"}
                </Text>

                <Button destructive plain>
                  Remove
                </Button>
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
                      className="aspect-auto h-auto w-full rounded-lg"
                    />
                  </HorizontalStack>
                )}

                {!imageFile && !imageUrl && <DropZone.FileUpload />}
              </DropZone>

              {layout === "DEFAULT"
                ? "Setting an image will override the background color."
                : ""}
            </VerticalStack>

            <Checkbox
              label="Use Call to Action"
              helpText="Adds a link for taking further action"
              checked={useCTA}
              onChange={(checked) => setUseCTA(checked)}
            />

            {useCTA && (
              <Grid columns={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                <Controller
                  control={control}
                  name="ctaText"
                  render={({ field }) => (
                    <TextField
                      label="CTA Text"
                      autoComplete="false"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="ctaUrl"
                  render={({ field }) => (
                    <TextField
                      label="CTA URL"
                      autoComplete="false"
                      {...field}
                    />
                  )}
                />
              </Grid>
            )}
          </>
        )}

        {!!password && (
          <Button
            primary
            disabled={!formState.isValid}
            onClick={() => onSubmit()}
          >
            Save
          </Button>
        )}
      </VerticalStack>

      {toasts.map((toast, index) => (
        <Toast
          content={toast}
          onDismiss={() => dismissToast(index)}
          key={index}
        />
      ))}
    </Card>
  );
};

export default CampaignAccessControlFormSlice;
