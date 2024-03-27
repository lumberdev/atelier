import { useState, MouseEvent } from "react";
import { Drawer } from "vaul";
import { NavigationMenu } from "@/assets/icons/Icons";
import CloseIcon from "@/assets/icons/x.svg";
import { useTheme } from "@/context/ThemeProvider";
import { getTextColor } from "@/lib/helper/colors";

const MobileNav = ({
    categories,
    onClick
}) => {
  const { global: { backgroundColor } } = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);

  const textColor = getTextColor(backgroundColor);

  function handleClick(event: MouseEvent<HTMLElement>, category:string = null) {
    onClick(event, category);
    setOpenDrawer(false);
  }

  const Body = () =>
    (
        <div className="header-menu text-xl font-semibold">
          <ul className="p-6 grid gap-y-4">
            <li>
              <a className="cursor-pointer" onClick={(event) => handleClick(event)}>All</a>
            </li>
            {categories.map((category: string) => (
              <li>
                <a className="cursor-pointer" onClick={(event) => handleClick(event, category)}>{category.replace("atelier:", "")}</a>
              </li>
            ))}
          </ul>
        </div>
    )


  return (
    <Drawer.Root
      direction="left"
      open={openDrawer}
      onOpenChange={setOpenDrawer}
    >
      <Drawer.Trigger aria-label="Open mobile nav drawer" className="relative">
        <NavigationMenu fill={textColor} />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/40" />

        <Drawer.Content
          className="fixed bottom-0 left-0 top-0 z-20 flex h-screen w-full flex-col items-stretch pt-8 md:max-w-sm"
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          <header className="flex items-center px-6">
            <Drawer.Close>
              <CloseIcon className="u-icon-stroke--black" />
            </Drawer.Close>
          </header>

          <Body />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileNav;
