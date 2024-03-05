import React, { ReactNode } from "react";
import classNames from "classnames";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

const PageContent: React.FC<PageContentProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "font-brand-heading text-2xl [&>p]:mb-8 [&>p]:font-brand-body [&>p]:text-base",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContent;
