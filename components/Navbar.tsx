import Section from "./Section";
import Link from "next/link";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  const linkStyle =
    "mx-4 sm:mx-8 no-underline hover:underline text-m sm:text-xl text-black";
  return (
    <Section>
      <div className="flex flex-col items-center justify-center max-w-full">
        <Link href={`/campaign/${campaignHandle}`} className="no-underline ">
          <h1 className="text-4xl text-black mx-1 my-8">{campaign?.title}</h1>
        </Link>
        <nav className="flex flex-row items-center justify-around my-8 max-w-full flex-wrap">
          <Link
            href={`/campaign/${campaignHandle}/`}
            className={linkStyle}
            key={"all"}
          >
            Shop All
          </Link>
          {collections.map(({ title, handle, id }) => (
            <Link
              href={`/campaign/${campaignHandle}/collections/${
                id.match(/\d+/)[0] || id
              }`}
              className={linkStyle}
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
