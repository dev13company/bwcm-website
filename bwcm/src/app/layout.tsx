import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from "react";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Berachah Ministries Moosapet",
  description: "A Place of Blessing & Worship",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-white text-[#0B4268]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}