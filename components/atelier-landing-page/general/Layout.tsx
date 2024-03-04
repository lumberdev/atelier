import React, { ReactNode } from "react";
import classNames from "classnames";
import { tavirajFont, dmMonoFont } from "@/lib/fonts";
import Navbar from "@/components/atelier-landing-page/Navbar";
import Footer from "@/components/atelier-landing-page/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className={classNames(
        dmMonoFont.variable,
        tavirajFont.variable,
        "relative"
      )}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
