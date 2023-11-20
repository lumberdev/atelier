import { useEffect, useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import NavLinks from "./NavLinks";
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

const Header = ({ campaign, campaignHandle, collections }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const {
    global: { primaryColor },
  } = useTheme() as { global: storeThemes };

  const navTextIconColor = primaryColor
    ? pickTextColorBasedOnBgColorAdvanced(primaryColor, "white", "black")
    : "";

  const navExpandBtnClick = () => {
    setIsNavExpanded((prev) => !prev);
  };

  const collapsedNavStyle = {
    flexWrap: "nowrap",
  } as React.CSSProperties;

  const expandedNavStyle = {
    flexWrap: "wrap",
  } as React.CSSProperties;

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
        <div className="flex hidden flex-row items-center justify-start overflow-hidden lg:flex">
          <div
            id="desktop-nav"
            className="mr-4 flex overflow-hidden"
            style={isNavExpanded ? expandedNavStyle : collapsedNavStyle}
          >
            <NavLinks
              {...{
                campaign,
                campaignHandle,
                collections,
                color: navTextIconColor,
              }}
            />
          </div>
          <button onClick={navExpandBtnClick} className="text-white">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 100.000000 100.000000"
              preserveAspectRatio="xMidYMid meet"
              className="duration-200"
              style={isNavExpanded ? { transform: "rotate(180deg)" } : {}}
            >
              <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
              </metadata>
              <g
                transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
                fill="#fff"
                stroke="none"
              >
                <path
                  d="M72 848 c-7 -7 -12 -19 -12 -28 0 -8 99 -114 220 -235 l220 -220 220
220 c121 121 220 227 220 235 0 20 -20 40 -39 40 -9 0 -102 -87 -208 -192
l-193 -193 -193 193 c-106 105 -199 192 -208 192 -8 0 -20 -5 -27 -12z"
                />
                <path
                  d="M72 588 c-7 -7 -12 -19 -12 -28 0 -8 99 -114 220 -235 l220 -220 220
220 c121 121 220 227 220 235 0 20 -20 40 -39 40 -9 0 -102 -87 -208 -192
l-193 -193 -193 193 c-106 105 -199 192 -208 192 -8 0 -20 -5 -27 -12z"
                />
              </g>
            </svg>
          </button>
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
