import Section from "./Section";
import Link from "next/link";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  return (
    <Section>
      <div className="flex flex-col items-center justify-center">
        <Link href={`/campaign/${campaignHandle}`} className="no-underline ">
          <h1 className="text-4xl text-black mx-1 my-8">{campaign?.title}</h1>
        </Link>
        <nav className="flex flex-row my-8">
          <Link
            href={`/campaign/${campaignHandle}/`}
            className="mx-8 no-underline text-xl text-black"
            key={"all"}
          >
            Shop All
          </Link>
          {collections.map(({ title, handle, id }) => (
            <Link
              href={`/campaign/${campaignHandle}/collections/${
                id.match(/\d+/)[0] || id
              }`}
              className="mx-8 no-underline text-xl text-black"
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
