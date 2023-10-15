"use client";
import "./globals.css";
import Header from "./components/Header";
import { Menu } from "./components/Menu";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Header /> */}
        <Menu menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
        {children}
      </body>
    </html>
  );
}
