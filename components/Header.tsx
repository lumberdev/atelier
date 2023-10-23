import HamburgerMenu from "./HamburgerMenu";
import NavLinks from "./NavLinks";
import LogoTitle from "./LogoTitle";

const Header = ({ campaign, campaignHandle, collections }) => {
  return (
    <div className="mt-16 xs:mt-0 xs:mb-4">
      <div className="header fixed w-full p-4 top-0 left-0 flex flex-row items-center justify-between xs:hidden transition-all">
        <HamburgerMenu>
          <NavLinks
            {...{ campaign, campaignHandle, collections, color: "white" }}
          />
        </HamburgerMenu>
        <LogoTitle {...{ campaign, campaignHandle }} />
        <div className="opacity-0 w-8 h-8 ">&nbsp;</div>
      </div>
      <div
        className={"flex flex-col items-center justify-center hidden xs:flex"}
      >
        <LogoTitle {...{ campaign, campaignHandle }} />
        <div className="flex flex-wrap flex-row items-center justify-center max-w-full">
          <NavLinks
            {...{ campaign, campaignHandle, collections, color: "black" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
