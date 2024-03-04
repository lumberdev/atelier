import { useTheme } from "@/context/ThemeProvider";
import { getTextColor } from "@/lib/helper/colors";
import { CSSProperties } from "react";

const AnnouncementBar = ({ announcement, className = "" }) => {
  const {
    global: { primaryColor },
  } = useTheme();

  if (!announcement) return null;

  return (
    <div
      className="bg-atelier-secondary px-3 py-2 text-center"
      style={
        {
          "--atelier-text-color": getTextColor(primaryColor),
        } as CSSProperties
      }
    >
      <p className={`${className} text-atelier-text w-full`}>{announcement}</p>
    </div>
  );
};

export default AnnouncementBar;
