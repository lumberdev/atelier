import React, { ReactNode } from "react";

interface ParentComponentProps {
  children: ReactNode; // Use ReactNode type to represent any JSX content
}

const Section: React.FC<ParentComponentProps> = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-center w-full m-4">
      {children}
    </div>
  );
};

export default Section;
