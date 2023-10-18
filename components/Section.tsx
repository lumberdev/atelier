import React, { ReactNode } from "react";

interface ParentComponentProps {
  children: ReactNode; // Use ReactNode type to represent any JSX content
}

const Section: React.FC<ParentComponentProps> = ({ children }) => {
  return (
    <div className="m-4 flex w-full flex-row items-center justify-center px-8">
      {children}
    </div>
  );
};

export default Section;
