import Link from "next/link";

const LogoTitle = ({ campaign, campaignHandle, className = "" }) => {
  return (
    <Link href={`/campaign/${campaignHandle}`} className={`no-underline ${className}`}>
      <h1 className="text-xl lg:text-3xl text-black mx-1 py-0 lg:py-8">
        {campaign?.title}
      </h1>
    </Link>
  );
};

export default LogoTitle;
