import { Card, Text, TextField, VerticalStack } from "@shopify/polaris";
import { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

const StoreCustomizationFormSlice: FC<{
  control: Control<FieldValues>;
  isLoading: boolean;
}> = ({ control, isLoading }) => {
  return (
    <Card>
      <VerticalStack gap="4">
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
      </VerticalStack>
    </Card>
  );
};

export default StoreCustomizationFormSlice;
