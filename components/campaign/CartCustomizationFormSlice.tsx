import {
  Card,
  ChoiceList,
  Text,
  TextField,
  VerticalStack,
} from "@shopify/polaris";
import { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

const CartCustomizationFormSlice: FC<{
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
          render={({ field }) => (
            <TextField
              label="Background Color"
              autoComplete="off"
              disabled={isLoading}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="cartTextColor"
          render={({ field }) => (
            <TextField
              label="Text Color"
              autoComplete="off"
              disabled={isLoading}
              {...field}
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

        <Controller
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
        />
      </VerticalStack>
    </Card>
  );
};

export default CartCustomizationFormSlice;
