import { useState, useCallback } from "react";
import {
  Card,
  ChoiceList,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  hsbToHex,
  hexToRgb,
  rgbToHsb,
  ColorPicker,
  Popover,
} from "@shopify/polaris";

import { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

const CartCustomizationFormSlice: FC<{
  control: Control<FieldValues>;
  isLoading: boolean;
}> = ({ control, isLoading }) => {
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });
  const handleChangeColor = (newValue) => {
    setColor(newValue);
    setColorValue(hsbToHex(color));
  };
  const [popoverActive, setPopoverActive] = useState(true);
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
  return (
    <Card>
      <BlockStack gap="400">
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
        <BlockStack gap="100">
          <Text as="p">Background Color</Text>
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
      </BlockStack>
    </Card>
  );
};

export default CartCustomizationFormSlice;
