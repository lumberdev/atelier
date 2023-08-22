const Page = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-[100vw]">
      {children}
    </div>
  );
};

export default Page;
