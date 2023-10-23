import HamburgerMenu from "./HamburgerMenu";
import NavLinks from "./NavLinks";
import LogoTitle from "./LogoTitle";
import { useCart } from "@/context/CartContext";
import CartEmpty from "./general/icons/CartEmpty";
import CartFilled from "./general/icons/CartFilled";


const Header = ({ campaign, campaignHandle, collections }) => {
  const { toggleCart, cartCount } = useCart();
  return (
    <div className="mt-16 lg:mt-0 lg:mb-4 w-full">
      <div className="header fixed lg:relative w-full top-0 left-0 grid grid-cols-[3rem_1fr_3rem] lg:grid-cols-3	items-center justify-between transition-all lg:px-16 py-2 px-4 lg:pt-0">
        <HamburgerMenu className={"lg:hidden"}>
          <NavLinks
            {...{ campaign, campaignHandle, collections, color: "white" }}
          />
        </HamburgerMenu>
        <div className="flex flex-row items-center justify-start hidden lg:flex">
          <NavLinks
            {...{ campaign, campaignHandle, collections, color: "black" }}
          />
        </div>
        <LogoTitle {...{ campaign, campaignHandle }} className={'text-center'}/>
        <div className="ml-auto">
          <button
            className="cursor-pointer border-none bg-transparent"
            onClick={toggleCart}
          >
            {cartCount >= 1 ? (
              <div className="relative">
                <CartFilled />
                <div className="absolute bottom-2 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black p-2 text-[0.5rem] text-white">
                  {cartCount}
                </div>
              </div>
            ) : (
              <CartEmpty />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
