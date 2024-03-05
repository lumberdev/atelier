import React, { ReactNode } from "react";
import classNames from "classnames";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <h2
      className={classNames("py-10 font-brand-heading text-[2rem]", className)}
    >
      {children}
    </h2>
  );
};

export default PageHeader;
