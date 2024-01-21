import React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";
import CloseIcon from "./general/icons/CloseIcon";

const Page = ({ children, campaign }) => {
  const [isDraftBarVisible, setIsDraftBarVisible] = useState(false);
  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };

  useEffect(() => {
    if (campaign && !campaign?.isActive) setIsDraftBarVisible(true);
  }, [campaign]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-start"
      style={
        backgroundColor && {
          backgroundColor: backgroundColor,
        }
      }
    >
      {children}
      {isDraftBarVisible && (
        <div className="align-center fixed bottom-0 z-50 flex w-screen justify-between bg-[rgba(0,0,0,0.7)] px-8 py-4 text-center text-white">
          <span></span>
          <span>
            This campaign is currently in draft mode and is only visible to you.
          </span>
          <button
            className="text-white"
            onClick={() => {
              setIsDraftBarVisible(false);
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
