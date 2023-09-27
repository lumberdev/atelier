import Section from "./Section";
import Link from "next/link";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  console.log(collections);
  return (
    <Section>
      <div className="flex flex-col items-center justify-center">
        <Link href={`/campaign/${campaignHandle}`} className="no-underline ">
          <h1 className="text-4xl text-black mx-1 my-8">{campaign?.title}</h1>
        </Link>
        <nav className="flex flex-row my-8">
          {collections.map(({ title, handle }) => (
            <Link
              href={`/campaign/${campaignHandle}/collections/${handle}`}
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
