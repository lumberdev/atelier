import { DM_Mono } from "next/font/google";
import { Taviraj } from "next/font/google";

export const dmMonoFont = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dmmono",
});

export const tavirajFont = Taviraj({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-taviraj",
});
