import Link from "next/link";

const NavLinks = ({ campaignHandle, collections, color }) => {
  const linkStyle = `mx-4 sm:mx-8 mb-2 sm:mb-0 no-underline hover:underline  text-xl text-${color}`;
  return (
    <>
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
    </>
  );
};

export default NavLinks;
