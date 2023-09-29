import React, { ReactNode } from "react";

interface ParentComponentProps {
  children: ReactNode; // Use ReactNode type to represent any JSX content
  className?: string;
}

const Section: React.FC<ParentComponentProps> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-row items-center justify-center w-full m-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
