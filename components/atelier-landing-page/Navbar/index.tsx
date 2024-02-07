import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import HamburgerIcon from "@/assets/hamburger-menu.svg";
import AtelierLogo from "@/assets/atelier-brand-logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function NavbarComponent() {
  // State to track whether the page is at the top
  const [isTop, setIsTop] = useState(true);

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
    <>
      <Navbar
        shouldHideOnScroll
        className={cn(
          "z-10 p-8 transition-background lg:px-[2.5rem] lg:py-[1.875rem]",
          isTop ? "bg-transparent" : "bg-brand-3/80"
        )}
      >
        <NavbarBrand>
          <Image src={AtelierLogo} alt="Atelier" width="120" height="40" />
        </NavbarBrand>
        <NavbarContent justify="end" className="flex gap-10">
          <Button variant="outline" className="rounded-none text-[0.875rem]">
            DOWNLOAD IN SHOPIFY
          </Button>
          <NavbarItem>
            <Drawer direction="right">
              <DrawerTrigger className="flex items-center">
                <Image
                  src={HamburgerIcon}
                  alt="Hamburger menu"
                  width="40"
                  height="20"
                />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>
                    This action cannot be undone.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
