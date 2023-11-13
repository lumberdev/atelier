import Link from "next/link";

const LogoTitle = ({
  campaign,
  campaignHandle,
  color = "black",
  className = "",
}) => {
  return (
    <Link
      href={`/campaign/${campaignHandle}`}
      className={`no-underline ${className}`}
    >
      <h1
        className="mx-1 py-0 text-xl text-black lg:py-8 lg:text-3xl"
        style={{ color: color }}
      >
        {campaign?.title}
      </h1>
    </Link>
  );
};

export default LogoTitle;
