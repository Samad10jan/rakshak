import type { Metadata } from "next";

import Header from "@/components/Header";
import "./globals.css";


export const metadata: Metadata = {
  title: "Rakshak",
  description: "API MADE IN NEXTjs FOR MY PROJECT :)",
  openGraph: {
    title: "Rakshak",
    description: "API MADE IN NEXTjs FOR MY PROJECT :)",
    url: "https://rakshak.vercel.app",
    siteName: "Rakshak",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`antialiased font-mono!`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
