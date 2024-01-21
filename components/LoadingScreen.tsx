import Spinner from "./Spinner";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";

const LoadingScreen = () => {
  const {
    global: { backgroundColor, secondaryColor },
  } = useTheme() as { global: storeThemes };
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center"
      style={
        backgroundColor && {
          backgroundColor: backgroundColor,
        }
      }
    >
      <Spinner color={secondaryColor} />
    </div>
  );
};

export default LoadingScreen;
