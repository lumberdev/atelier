import { Card, Text, TextField, BlockStack } from "@shopify/polaris";
import { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

const StoreCustomizationFormSlice: FC<{
  control: Control<FieldValues>;
  isLoading: boolean;
}> = ({ control, isLoading }) => {
  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingSm" as="h3">
          Store Details
        </Text>

        <Controller
          control={control}
          name="announcement"
          render={({ field }) => (
            <TextField
              label="Announcement Bar"
              autoComplete="off"
              disabled={isLoading}
              {...field}
            />
          )}
        />
      </BlockStack>
    </Card>
  );
};

export default StoreCustomizationFormSlice;