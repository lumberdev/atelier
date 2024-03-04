import * as React from "react";
import { Button } from "@/components/ui/button";
import AtelierLogo from "@/assets/logos/atelier-brand-logo.svg";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import NavDrawer from "@/components/atelier-landing-page/Navbar/NavDrawer";

export default function NavbarComponent() {
  // State to track whether the page is at the top
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      // Check if the scroll position is at the top of the page
      const scrollPosition = window.scrollY;
      setIsTop(scrollPosition < 100);
    };

    // Add the event listener for the scroll event
    window.addEventListener("scroll", onScroll);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div
      className={classNames(
        "z-10 flex w-full items-center justify-between px-6 py-6  transition-background lg:px-10 lg:py-[1.7rem] ",
        isTop ? "bg-transparent" : "bg-brand-3/70 backdrop-blur-md",
        pathname === "/" ? "fixed" : "sticky"
      )}
    >
      <div>
        <AtelierLogo width={120} height={40} />
      </div>
      <div className="flex justify-end gap-10">
        <Button variant="outline" className="rounded-none text-[0.875rem]">
          DOWNLOAD IN SHOPIFY
        </Button>
        <NavDrawer />
      </div>
    </div>
  );
}
