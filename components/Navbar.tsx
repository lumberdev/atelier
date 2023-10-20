import Section from "./Section";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartEmpty from "./general/icons/CartEmpty";
import CartFilled from "./general/icons/CartFilled";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  const { toggleCart, cartCount } = useCart();
  return (
    <Section>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1"></div>
          <Link
            href={`/campaign/${campaignHandle}`}
            className="flex-1 text-center no-underline"
          >
            <h1 className="mx-1 my-8 text-4xl text-black">{campaign?.title}</h1>
          </Link>
          <div className="flex-1 text-right">
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
        <nav className="my-8 flex flex-row">
          {collections.map(({ title, handle }) => (
            <Link
              href={`/campaign/${campaignHandle}/`}
              className="mx-8 text-xl text-black no-underline"
              key={handle}
            >
              {title}
            </Link>
          ))}
        </nav>
      </div>
    </Section>
  );
};

export default NavBar;
