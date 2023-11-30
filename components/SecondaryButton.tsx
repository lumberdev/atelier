import { storeThemes } from "@prisma/client";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import { useTheme } from "@/lib/hooks/store/useTheme";

const SecondaryButton = ({ children, ...props }) => {
  const {
    global: { secondaryColor, borderRadius },
  } = useTheme() as { global: storeThemes };

  const buttonTextColor = secondaryColor
    ? pickTextColorBasedOnBgColorAdvanced(secondaryColor, "white", "black")
    : "";

  return (
    <button
      type="button"
      className="mt-4 cursor-pointer rounded px-4 py-2 uppercase disabled:opacity-50"
      style={{
        backgroundColor: secondaryColor,
        color: buttonTextColor,
        borderRadius: borderRadius,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
