import { useEffect, useState } from "react";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";
import {
  pickTextColorBasedOnBgColorAdvanced,
  getOppositeColor,
} from "@/lib/helper/colors";

const AnnouncementBar = ({ announcement, className = "" }) => {
  const {
    global: { secondaryColor },
  } = useTheme() as { global: storeThemes };

  const announcementTextColor = secondaryColor
    ? pickTextColorBasedOnBgColorAdvanced(secondaryColor, "white", "black")
    : "";

  if (!announcement) return null;
  return (
    <h3
      id="announcement-bar"
      className={`${className} w-full bg-[grey] px-3 py-2 text-center text-sm text-white`}
      style={{
        backgroundColor: secondaryColor,
        color: announcementTextColor,
      }}
    >
      {announcement}
    </h3>
  );
};

export default AnnouncementBar;
