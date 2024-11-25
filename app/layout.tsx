import type { Metadata } from "next";
import { Inter, Dhurjati } from "next/font/google";
import "./globals.css";

import { AppStateProvider } from "@/utils/AppStateProvider";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/functions/ThemeProvider";

import LayoutWrapper from "@/app/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
const dhurjati = Dhurjati({ weight: "400", subsets: ["latin"], variable: "--font-dhurjati" });

export const metadata: Metadata = {
  title: "SoopSok",
  description: "Your favourite chat application",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dhurjati.variable}`}>
        <AppStateProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LayoutWrapper>
              { children }
            </LayoutWrapper>
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
};
