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

export default function NavbarComponent() {
  return (
    <>
      <Navbar shouldHideOnScroll className="p-8 lg:px-[4rem] lg:py-[3rem] z-10">
        <NavbarBrand>
          <Image
            src={AtelierLogo}
            alt="Atelier"
            width="120"
            height="40"
          />
        </NavbarBrand>
        <NavbarContent justify="end" className="flex gap-16">
          <Button
            variant="outline"
            className="text-[1.4rem] rounded-none"
          >
            DOWNLOAD IN SHOPIFY
          </Button>
          <NavbarItem>
            <Drawer direction="right">
              <DrawerTrigger>
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
