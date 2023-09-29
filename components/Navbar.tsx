import HamburgerMenu from "./HamburgerMenu";
import Section from "./Section";
import NavLinks from "./NavLinks";

const NavBar = ({ campaign, campaignHandle, collections }) => {
  return (
    <Section>
      <HamburgerMenu className={"block xs:hidden"}>
        <NavLinks
          {...{ campaign, campaignHandle, collections, color: "white" }}
        />
      </HamburgerMenu>
      <div className=" flex-row items-center justify-center max-w-full hidden xs:flex ">
        <NavLinks
          {...{ campaign, campaignHandle, collections, color: "black" }}
        />
      </div>
    </Section>
  );
};

export default NavBar;
