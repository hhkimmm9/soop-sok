import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppStateProvider } from '@/utils/AppStateProvider';
import Wrapper from '@/components/Wrapper';

const inter = Inter({ subsets: ["latin"] });

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
        <body className={inter.className}>
          <Wrapper>
            { children }
          </Wrapper>
        </body>
      </AppStateProvider>
    </html>
  );
}
