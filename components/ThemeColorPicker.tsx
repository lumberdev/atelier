import { useState, useCallback } from "react";
import {
    BlockStack,
    InlineStack,
    Text,
    Popover,
    ColorPicker,
    TextField,
    rgbToHsb,
    hsbToHex,
    hexToRgb
} from "@shopify/polaris";
import classNames from "classnames";

const ThemeColorPicker = ({
    label = "Color Picker",
    fieldName = "",
    helpText = "",
    colorValue = "",
    onChangeField = (value: string, label: string) => {}
}) => {
    const [color, setColor] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });
    const handleChangeColor = (newValue) => {
        setColor(newValue);

        // change textfield prop as well
        onChangeField(hsbToHex(newValue), fieldName);
    };
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        []
    );

    const activator = (
        <div
            onClick={togglePopoverActive}
            className={`inline-block h-9 w-9 cursor-pointer rounded-md ${classNames({
                "border border-neutral-400 border-solid": colorValue.toLowerCase().includes("#fff")
            })}`}
            style={{
                background: `${colorValue}`,
            }}
        ></div>
    );


    return (
        <BlockStack gap="100">
            <Text as="p">{label}</Text>
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
                            const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                            if (hexRegex.test(value)) {
                                setColor(rgbToHsb(hexToRgb(value)));
                            }

                            onChangeField(value, fieldName);
                        }}
                        autoComplete="off"
                        helpText={helpText}
                    />
                </div>
            </InlineStack>
        </BlockStack>
    )
}

export default ThemeColorPicker;