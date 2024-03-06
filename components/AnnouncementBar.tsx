import { useTheme } from "@/context/ThemeProvider";
import { getTextColor } from "@/lib/helper/colors";
import { CSSProperties } from "react";

const AnnouncementBar = ({ 
  announcement, 
  announcementBgColor, 
  announcementTextColor,
  className = "" 
}) => {
  const {
    global: { primaryColor },
  } = useTheme();

  if (!announcement) return null;

  return (
    <div
      className={`px-3 py-2 text-center ${
        announcementBgColor ? "bg-atelier-announcement" : "bg-atelier-secondary"
      }`}
      style={
        {
          "--atelier-text-color": announcementTextColor || getTextColor(primaryColor),
          "--atelier-bg-color": announcementBgColor,
        } as CSSProperties
      }
    >
      <p className={`${className} text-atelier-text w-full`}>{announcement}</p>
    </div>
  );
};

export default AnnouncementBar;
