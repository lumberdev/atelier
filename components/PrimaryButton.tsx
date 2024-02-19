import { useTheme } from "@/context/ThemeProvider";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";

const PrimaryButton = ({ children, ...props }) => {
  const {
    global: { primaryColor, borderRadius },
  } = useTheme();

  const backgroundColor = primaryColor ? primaryColor : "grey";
  const buttonTextColor = pickTextColorBasedOnBgColorAdvanced(
    backgroundColor,
    "white",
    "black"
  );

  return (
    <button
      type="button"
      className="mt-4 cursor-pointer rounded px-4 py-2 uppercase disabled:opacity-50"
      style={{
        backgroundColor: backgroundColor,
        color: buttonTextColor,
        borderRadius: borderRadius,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
