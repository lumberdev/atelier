import Section from "./Section";
import Link from "next/link";

const NavBar = ({ campaign, campaign_handle }) => {
  return (
    <>
      <Section>
        <div className="flex flex-col items-center justify-center">
          <Link href={`/campaign/${campaign_handle}`}>
            <h1 className="text-4xl mx-1 my-8">{campaign?.title}</h1>
          </Link>
          <nav className="flex flex-row my-8">
            {["Dresses", "Jeans", "Hat"].map((linkTitle) => (
              <Link href="/" className="mx-1" key={linkTitle}>
                {linkTitle}
              </Link>
            ))}
          </nav>
        </div>
      </Section>
    </>
  );
};

export default NavBar;
