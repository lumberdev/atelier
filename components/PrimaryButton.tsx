import { storeThemes } from "@prisma/client";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import { useTheme } from "@/lib/hooks/useTheme";

const PrimaryButton = ({ children, ...props }) => {
  const {
    global: { primaryColor },
  } = useTheme() as { global: storeThemes };

  const buttonTextColor = primaryColor
    ? pickTextColorBasedOnBgColorAdvanced(primaryColor, "white", "black")
    : "";

  return (
    <button
      type="button"
      className="mt-4 cursor-pointer rounded px-4 py-2 uppercase disabled:opacity-50"
      style={
        primaryColor && {
          backgroundColor: primaryColor,
          color: buttonTextColor,
        }
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
