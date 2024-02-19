import { useTheme } from "@/context/ThemeProvider";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";

const AnnouncementBar = ({ announcement, className = "" }) => {
  const {
    global: { secondaryColor },
  } = useTheme();

  const announcementTextColor = secondaryColor
    ? pickTextColorBasedOnBgColorAdvanced(secondaryColor, "white", "black")
    : "";

  if (!announcement) return null;
  return (
    <div
      className="bg-[grey] px-3 py-2 text-center"
      style={{
        backgroundColor: secondaryColor,
        color: announcementTextColor,
      }}
    >
      <p className={`${className} w-full text-sm text-white`}>{announcement}</p>
    </div>
  );
};

export default AnnouncementBar;
