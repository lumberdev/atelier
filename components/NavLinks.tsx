import Link from "next/link";

const NavLinks = ({ campaignHandle, collections, color = "black" }) => {
  const linkStyle = `mr-[16px] mb-2 lg:mb-0 no-underline hover:underline text-base whitespace-nowrap	 text-${color}`;
  return (
    <>
      <Link
        href={`/${campaignHandle}/`}
        className={linkStyle}
        key={"all"}
      >
        Shop All
      </Link>
      {collections.map(({ title, handle, id }) => (
        <Link
          href={`/${campaignHandle}/collections/${
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
