import LogoTitle from "./LogoTitle";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/lib/hooks/store/useTheme";
import CartEmpty from "./general/icons/CartEmpty";
import CartFilled from "./general/icons/CartFilled";
import { storeThemes } from "@prisma/client";
import {
  pickTextColorBasedOnBgColorAdvanced,
  getOppositeColor,
} from "@/lib/helper/colors";
import AnnouncementBar from "./AnnouncementBar";
import Container from "./general/Container";
import classNames from "classnames";
import { FC } from "react";

const Header: FC<{
  title: string;
  campaignHandle: string;
  announcement?: string;
}> = ({ campaignHandle, title, announcement }) => {
  const { toggleCart, cartCount } = useCart();
  const {
    global: { primaryColor, logoPosition },
  } = useTheme() as { global: storeThemes };

  const navTextIconColor = primaryColor
    ? pickTextColorBasedOnBgColorAdvanced(primaryColor, "white", "black")
    : "black";

  return (
    <div
      className="sticky left-0 top-0 z-10 lg:mb-4"
      style={{ backgroundColor: primaryColor }}
    >
      {announcement && <AnnouncementBar announcement={announcement} />}

      <Container className="grid w-full grid-cols-[1fr_3fr_1fr] items-center justify-between	bg-white transition-all lg:relative lg:grid-cols-3 lg:px-16 lg:py-4">
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
          color={navTextIconColor}
        />

        <div className="col-start-3 flex h-[40px] items-center justify-end">
          <button
            className="cursor-pointer border-none bg-transparent"
            onClick={toggleCart}
          >
            {cartCount >= 1 ? (
              <div className="relative">
                <CartFilled color={navTextIconColor} />
                <div
                  className="absolute bottom-2 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black p-2 text-[0.5rem] text-white"
                  style={{
                    backgroundColor: navTextIconColor,
                    color: getOppositeColor(navTextIconColor),
                  }}
                >
                  {cartCount}
                </div>
              </div>
            ) : (
              <CartEmpty color={navTextIconColor} />
            )}
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Header;
