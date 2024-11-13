import type { Metadata } from "next";
import { Inter, Dhurjati } from "next/font/google";
import "./globals.css";

import { AppStateProvider } from "@/utils/AppStateProvider";
import Wrapper from "@/app/Wrapper";

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
      <AppStateProvider>
        <body className={`${inter.variable} ${dhurjati.variable}`}>
          <Wrapper>
            { children }
          </Wrapper>
        </body>
      </AppStateProvider>
    </html>
  );
};
