import {
  Card,
  ChoiceList,
  Text,
  TextField,
  BlockStack,
} from "@shopify/polaris";

import { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import ThemeColorPicker from "@/components/ThemeColorPicker";

const CartCustomizationFormSlice: FC<{
  control: Control<FieldValues>;
  isLoading: boolean;
}> = ({ control, isLoading }) => {
  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingSm" as="h3">
          Cart Details
        </Text>

        <Controller
          control={control}
          name="cartTitle"
          render={({ field }) => (
            <TextField
              label="Cart Title"
              autoComplete="off"
              disabled={isLoading}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="cartBackgroundColor"
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
        <Controller
          control={control}
          name="cartTextColor"
          render={({ field: { onChange, name, value } }) => (
            <ThemeColorPicker
              label="Text Color"
              onChangeField={onChange}
              fieldName={name}
              colorValue={value}
            />
          )}
        />
        <Controller
          control={control}
          name="cartItemsImageStyle"
          render={({ field: { value, onChange, ...field } }) => (
            <ChoiceList
              title="Image Style"
              choices={[
                { label: "Round", value: "round" },
                { label: "Square", value: "square" },
              ]}
              selected={[value]}
              onChange={([value]) => onChange(value)}
              disabled={isLoading}
              {...field}
            />
          )}
        />
        {/* Commenting this out for now */}
        {/* TODO: enable this once the description component is added to cart */}
        {/* <Controller
          control={control}
          name="cartDescription"
          render={({ field }) => (
            <TextField
              multiline={4}
              label="Cart Description"
              autoComplete="off"
              disabled={isLoading}
              {...field}
            />
          )}
        /> */}
      </BlockStack>
    </Card>
  );
};

export default CartCustomizationFormSlice;
