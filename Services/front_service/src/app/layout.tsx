import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Tiny5 } from "next/font/google";
import { Onest } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const tinyf = Tiny5({
  weight: "400",
  variable: "--font-tiny-f",
  subsets: ["cyrillic"],
})

const onest = Onest({
  weight: ["400", "600"],
  variable: "--font-onest",
  subsets: ["cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Лаборатория Кибербезопасности",
  description: "Учись кибербезопасности выполняя задания",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${onest.variable} ${tinyf.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
