import Link from "next/link";

const NavLinks = ({ campaignHandle, collections, color }) => {
  const linkStyle = `mx-4 lg:mx-2 first:lg:ml-0 first:ml-4 mb-2 lg:mb-0 no-underline hover:underline text-base whitespace-nowrap	 text-${color}`;
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
