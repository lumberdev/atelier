import { useState } from "react";
import { Drawer } from "vaul";
import HamburgerIcon from "@/assets/icons/hamburger-menu.svg";
import CloseIcon from "@/assets/icons/x.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dmMonoFont } from "@/lib/fonts";
import classNames from "classnames";

const NavBarItemClassNames = "cursor-pointer font-brand-heading";

const NavDrawer = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const handleNavItemClick = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.history.pushState(null, "", `/#${id}`);
      setTimeout(() => {
        element.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 350); // close the drawer before scrolling
    }
  };

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger aria-label="Open cart drawer" className="relative">
        <HamburgerIcon width={40} height={21} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/40 backdrop-blur-md" />

        <Drawer.Content
          className={classNames(
            dmMonoFont.variable,
            "fixed bottom-0 right-0 top-0 z-20 flex h-screen w-full flex-col items-stretch bg-brand-1 px-6 pt-8 md:max-w-sm"
          )}
        >
          <header className="flex items-center justify-end">
            <Drawer.Close>
              <CloseIcon class="u-icon-stroke--white" />
            </Drawer.Close>
          </header>
          <div className="my-10 flex flex-col gap-10 font-brand-heading text-[1.75rem] uppercase text-brand-3">
            {pathname === "/" ? (
              <>
                <div
                  className={"cursor-pointer"}
                  onClick={() => handleNavItemClick("features")}
                >
                  Features
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleNavItemClick("pricing")}
                >
                  Pricing
                </div>
              </>
            ) : (
              <>
                <Link href="/#features" scroll={false}>
                  Features
                </Link>
                <Link href="/#pricing" scroll={false}>
                  Pricing
                </Link>
              </>
            )}
            <Link href="/pages/faq">FAQs</Link>
            <Link href="https://apps.shopify.com" target="_blank">
              Download in Shopify
            </Link>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default NavDrawer;
