import { useState } from "react";
import { Drawer } from "vaul";
import HamburgerIcon from "@/assets/icons/hamburger-menu.svg";
import CloseIcon from "@/assets/icons/x.svg";

const NavDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger aria-label="Open cart drawer" className="relative">
        <HamburgerIcon width={40} height={21} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/40 backdrop-blur-md" />

        <Drawer.Content className="fixed bottom-0 right-0 top-0 z-20 flex h-screen w-full flex-col items-stretch bg-white pt-8 md:max-w-sm">
          <header className="flex items-center justify-end px-6">
            <Drawer.Close>
              <CloseIcon class="u-icon-stroke--black" />
            </Drawer.Close>
          </header>
          <div>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default NavDrawer;
