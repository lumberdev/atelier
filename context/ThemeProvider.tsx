import getThemeConfig from "@/lib/theme/getThemeConfig";
import { FC, ReactNode, createContext, useContext } from "react";

type IThemeContext = Awaited<ReturnType<typeof getThemeConfig>> | null;

const ThemeContext = createContext<IThemeContext>(null);
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: FC<{ theme: IThemeContext; children: ReactNode }> = ({
  theme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
