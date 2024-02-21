import LogoTitle from "./LogoTitle";
import { getTextColor } from "@/lib/helper/colors";
import AnnouncementBar from "./AnnouncementBar";
import Container from "./general/Container";
import classNames from "classnames";
import { FC } from "react";
import MiniCart from "./cart/MiniCart";
import { useTheme } from "@/context/ThemeProvider";

const Header: FC<{
  title: string;
  campaignHandle: string;
  announcement?: string;
}> = ({ campaignHandle, title, announcement }) => {
  const {
    global: { primaryColor, logoPosition },
  } = useTheme();

  const textColor = getTextColor(primaryColor);

  return (
    <div
      className="sticky left-0 top-0 z-10 lg:mb-4"
      style={{ backgroundColor: primaryColor, color: textColor }}
    >
      {announcement && <AnnouncementBar announcement={announcement} />}

      <Container className="grid w-full grid-cols-[1fr_3fr_1fr] items-center justify-between transition-all lg:relative lg:grid-cols-3 lg:px-16 lg:py-4">
        <div
          className={classNames({
            "col-start-1": logoPosition === "center",
            "col-start-2": logoPosition !== "center",
          })}
        />

        <LogoTitle
          title={title}
          handle={campaignHandle}
          className={classNames({
            "col-start-1 text-left": logoPosition !== "center",
            "col-start-2 justify-center text-center": logoPosition === "center",
          })}
          color={textColor}
        />

        <div className="col-start-3 flex h-[40px] items-center justify-end">
          <MiniCart />
        </div>
      </Container>
    </div>
  );
};

export default Header;
