import * as React from "react";
import { Button } from "@/components/ui/button";
import AtelierLogo from "@/assets/logos/atelier-brand-logo.svg";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import NavDrawer from "@/components/atelier-landing-page/Navbar/NavDrawer";
import Link from "next/link";

export default function NavbarComponent() {
  // State to track whether the page is at the top
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY;
      setIsTop(scrollPosition < 100);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []); 

  return (
    <div
      className={classNames(
        "transition-background z-10 flex w-full items-center justify-between px-6  py-6 lg:px-10 lg:py-[1.7rem] ",
        isTop && isLandingPage
          ? "bg-transparent"
          : "bg-brand-3/70 backdrop-blur-md",
        isTop && !isLandingPage
          ? "bg-brand-3"
          : "bg-brand-3/70 backdrop-blur-md",
        isLandingPage ? "fixed" : "sticky left-0 top-0"
      )}
    >
      <Link href="/">
        <AtelierLogo width={120} height={40} />
      </Link>
      <div className="flex justify-end gap-10">
        <Button
          variant="outline"
          className="hidden items-center rounded-none text-[0.875rem] md:flex"
        >
          <Link href="https://apps.shopify.com" target="_blank">
            DOWNLOAD IN SHOPIFY
          </Link>
        </Button>
        <NavDrawer />
      </div>
    </div>
  );
}
