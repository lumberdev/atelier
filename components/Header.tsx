import HamburgerMenu from "./HamburgerMenu";
import NavLinks from "./NavLinks";
import LogoTitle from "./LogoTitle";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/lib/hooks/useTheme";
import CartEmpty from "./general/icons/CartEmpty";
import CartFilled from "./general/icons/CartFilled";
import { storeThemes } from "@prisma/client";
import {
  pickTextColorBasedOnBgColorAdvanced,
  getOppositeColor,
} from "@/lib/helper/colors";

const Header = ({ campaign, campaignHandle, collections }) => {
  const { toggleCart, cartCount } = useCart();
  const {
    global: { primaryColor },
  } = useTheme() as { global: storeThemes };

  const navTextIconColor = primaryColor
    ? pickTextColorBasedOnBgColorAdvanced(primaryColor, "white", "black")
    : "";

  return (
    <div
      className="z-10 mt-[5rem] w-full lg:mb-4 lg:mt-0"
      style={
        primaryColor && {
          backgroundColor: primaryColor,
        }
      }
    >
      <div
        className="header fixed left-0 top-0 grid w-full grid-cols-[3rem_1fr_3rem] items-center justify-between	px-4 py-2 transition-all lg:relative lg:grid-cols-3 lg:px-16 lg:py-4"
        style={
          primaryColor && {
            backgroundColor: primaryColor,
          }
        }
      >
        <HamburgerMenu className={"lg:hidden"} color={navTextIconColor}>
          <NavLinks
            {...{
              campaign,
              campaignHandle,
              collections,
              color: navTextIconColor,
            }}
          />
        </HamburgerMenu>
        <div className="flex hidden flex-row items-center justify-start lg:flex">
          <NavLinks
            {...{
              campaign,
              campaignHandle,
              collections,
              color: navTextIconColor,
            }}
          />
        </div>
        <LogoTitle
          {...{ campaign, campaignHandle }}
          className={"text-center"}
          color={navTextIconColor}
        />
        <div className="ml-auto">
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
      </div>
    </div>
  );
};

export default Header;
