import HamburgerMenu from "./HamburgerMenu";
import Section from "./Section";
import NavLinks from "./NavLinks";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  return (
    <>
      <HamburgerMenu className={"block xs:hidden"}>
        <NavLinks
          {...{ campaign, campaignHandle, collections, color: "white" }}
        />
      </HamburgerMenu>
      <Section className={"hidden xs:flex"}>
        <div className="flex flex-wrap flex-row items-center justify-center max-w-full">
          <NavLinks
            {...{ campaign, campaignHandle, collections, color: "black" }}
          />
        </div>
      </Section>
    </>
  );
};

export default NavBar;
