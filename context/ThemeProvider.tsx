import getThemeConfig from "@/lib/theme/getThemeConfig";
import { FC, ReactNode, createContext, useContext } from "react";

type IThemeContext = Awaited<ReturnType<typeof getThemeConfig>> | null;

const ThemeContext = createContext<IThemeContext>(null);
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: FC<{ theme: IThemeContext; children: ReactNode }> = ({
  theme,
  children,
}) => {
  if (!theme) return children;

  return (
    <ThemeContext.Provider value={theme}>
      <style jsx global>{`
        :root {
          --atelier-primary-color: ${theme.global.primaryColor};
          --atelier-secondary-color: ${theme.global.secondaryColor};
          --atelier-bg-color: ${theme.global.backgroundColor};
          --atelier-text-color: ${theme.global.textColor};
          --atelier-border-radius: ${theme.global.borderRadius}px;
        }
      `}</style>

      <div className="bg-atelier text-base">{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
