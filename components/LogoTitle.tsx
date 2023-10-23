import Link from "next/link";

const LogoTitle = ({ campaign, campaignHandle }) => {
  return (
    <Link href={`/campaign/${campaignHandle}`} className="no-underline ">
      <h1 className="text-xl xs:text-3xl text-black mx-1 my-0 xs:my-8">
        {campaign?.title}
      </h1>
    </Link>
  );
};

export default LogoTitle;