import Section from "./Section";
import Link from "next/link";
import { capitalize } from "@/lib/helper/text";

const NavBar = ({ campaign, handle }) => {
  console.log(campaign);
  return (
    <Section>
      <div className="flex flex-col items-center justify-center">
        <Link href={`/campaign/${handle}`} className="no-underline ">
          <h1 className="text-4xl text-black mx-1 my-8">{campaign?.title}</h1>
        </Link>
        <nav className="flex flex-row my-8">
          {["dresses", "jeans", "hat"].map((linkTitle) => (
            <Link
              href={`/campaign/${handle}/collection/${linkTitle}`}
              className="mx-8 no-underline text-xl text-black"
              key={linkTitle}
            >
              {capitalize(linkTitle)}
            </Link>
          ))}
        </nav>
      </div>
    </Section>
  );
};

export default NavBar;
