import Section from "./Section";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  const { toggleCart } = useCart();
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
            <button className="cursor-pointer" onClick={toggleCart}>
              Cart
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
