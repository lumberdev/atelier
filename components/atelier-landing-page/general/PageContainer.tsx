import React, { ReactNode } from "react";
import classNames from "classnames";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <h2
      className={classNames(
        "mx-auto max-w-[90rem] flex-1 px-6 lg:px-10",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default PageContainer;
