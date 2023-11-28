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
import AnnouncementBar from "./AnnouncementBar";

const Header = ({ campaign, campaignHandle, collections }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const {
    global: { primaryColor, logoPosition },
  } = useTheme() as { global: storeThemes };

  const navTextIconColor = primaryColor
    ? pickTextColorBasedOnBgColorAdvanced(primaryColor, "white", "black")
    : "black";

  const navExpandBtnClick = () => {
    setIsNavExpanded((prev) => !prev);
  };

  const collapsedNavStyle = {
    flexWrap: "nowrap",
  } as React.CSSProperties;

  const expandedNavStyle = {
    flexWrap: "wrap",
  } as React.CSSProperties;

  const checkIfNavHorizontalOverflow = () => {
    const desktopNav = document.getElementById("desktop-nav");
    const expandButton = document.querySelector(".expand-button");
    return (
      desktopNav.scrollWidth <=
      desktopNav.clientWidth + expandButton.clientWidth
    );
  };

  const changeExpandButtonVisibility = () => {
    const desktopNav = document.getElementById("desktop-nav");
    if (desktopNav.classList.contains("expanded")) return;
    const expandButton = document.querySelector(".expand-button");
    const navOverflowing = checkIfNavHorizontalOverflow();
    if (navOverflowing) {
      expandButton.classList.add("hidden");
      setIsNavExpanded(false);
    } else {
      expandButton.classList.remove("hidden");
    }
  };

  // if desktop-nav is small enough to put on 1 line when expanded, then hide the expand button. recheck on resize
  useEffect(() => {
    changeExpandButtonVisibility();
    window.addEventListener("resize", changeExpandButtonVisibility);
    return () => {
      window.removeEventListener("resize", changeExpandButtonVisibility);
    };
  }, []);

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
        className="header fixed left-0 top-0 grid w-full grid-cols-[3rem_1fr_3rem] items-center justify-between	bg-white p-0 transition-all lg:relative lg:grid-cols-3 lg:px-16 lg:py-4"
        style={
          primaryColor && {
            backgroundColor: primaryColor,
          }
        }
      >
        <AnnouncementBar
          announcement={campaign?.announcement}
          className="col-span-3 lg:hidden"
        />
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
        {logoPosition === "left" && (
          <LogoTitle
            {...{ campaign, campaignHandle }}
            className={"justify-center text-center"}
            color={navTextIconColor}
          />
        )}
        <div
          className={`hidden flex-row items-center justify-start overflow-hidden lg:flex ${
            logoPosition == "left" ? "justify-center" : ""
          }`}
        >
          <div
            id="desktop-nav"
            className="flex overflow-hidden"
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
          <button className="expand-button ml-4" onClick={navExpandBtnClick}>
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
              <g
                transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
                fill={navTextIconColor}
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
        {logoPosition === "center" && (
          <LogoTitle
            {...{ campaign, campaignHandle }}
            className={"justify-center text-center"}
            color={navTextIconColor}
          />
        )}
        <div className="ml-auto">
          <button
            className="cursor-pointer border-none bg-transparent"
            onClick={toggleCart}
          >
            {cartCount >= 1 ? (
              <div className="relative h-[40px]">
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
