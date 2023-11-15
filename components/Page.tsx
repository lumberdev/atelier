import { useTheme } from "@/lib/hooks/useTheme";
import { storeThemes } from "@prisma/client";

const Page = ({ children }) => {
  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-start"
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
