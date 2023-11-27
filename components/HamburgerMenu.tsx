import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";

const HamburgerMenu = ({ children, className = "", color = "black" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    global: { primaryColor },
  } = useTheme() as { global: storeThemes };

  useEffect(() => {
    const closeMenu = (e) => {
      if (isOpen && e.target.closest(".hamburger-menu") === null) {
        setIsOpen(false);
      }
    };

    const hamburgerMenu =
      document.querySelector<HTMLElement>(".hamburger-menu");
    if (isOpen) {
      // Prevent scrolling on the background
      document.body.style.overflow = "hidden";
      hamburgerMenu.style.left = "0";
      window.addEventListener("click", closeMenu);
    } else {
      // Re-enable scrolling on the background
      document.body.style.overflowY = "scroll";
      hamburgerMenu.style.left = "-100%";
      window.removeEventListener("click", closeMenu);
    }

    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflowY = "scroll";
      window.removeEventListener("click", closeMenu);
    };
  }, [isOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const router = useRouter();
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  return (
    <div className={`relative ${className}`}>
      <button
        className="z-10 border-none bg-transparent p-2"
        onClick={toggleMenu}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 10H15M1 4H19M1 16H19"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className="hamburger-menu fixed left-[-100%] top-0 z-50 h-full w-full transition-all"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center justify-between px-6 pt-[1.5rem]">
          <h2 className="text-2xl font-semibold "></h2>{" "}
          <button className="text-inherit" onClick={() => setIsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              className="cursor-pointer"
            >
              <path
                stroke={color}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 1 1 13M1 1l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="m-8 flex flex-col ">{children}</div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
