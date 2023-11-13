import { useTheme } from "@/lib/hooks/useTheme";
import { storeThemes } from "@prisma/client";

const Page = ({ children }) => {
  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={
        backgroundColor && {
          backgroundColor: backgroundColor,
        }
      }
    >
      {children}
    </div>
  );
};

export default Page;
