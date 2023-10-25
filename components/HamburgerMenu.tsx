import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const HamburgerMenu = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  // On scroll away from the top, add a background to the header
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".header");
    const handleScroll = () => {
      if (window.scrollY > 0) {
        header.classList.add("bg-gray-300/80");
      } else {
        header.classList.remove("bg-gray-300/80");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        className="z-10 p-2 bg-transparent border-none"
        onClick={toggleMenu}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 10H15M1 4H19M1 16H19" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div
        className="fixed top-0 left-[-100%] h-full w-full z-50 hamburger-menu transition-all"
        onClick={toggleMenu}
      >
        <div
          className="w-3/5 bg-gray-900/80 transform -translate-x-full transition-transform duration-300 ease-in-out absolute top-0 left-0 h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-8 text-white flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
