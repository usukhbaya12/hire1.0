"use client";

import { usePathname } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Zoom from "@/components/Zoom";
import { Provider } from "@/components/Provider";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gilroy = localFont({
  src: [
    {
      path: "./fonts/Gilroy-Thin.ttf",
      weight: "300",
    },
    {
      path: "./fonts/Gilroy-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/Gilroy-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/Gilroy-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "./fonts/Gilroy-Bold.ttf",
      weight: "700",
    },
    {
      path: "./fonts/Gilroy-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "./fonts/Gilroy-Black.ttf",
      weight: "900",
    },
    {
      path: "./fonts/Gilroy-Heavy.ttf",
      weight: "1000",
    },
  ],
  variable: "--font-gilroy",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/auth/") || pathname.includes("/exam/");
  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Онлайн тест, хөндлөнгийн үнэлгээний платформ"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.hire.mn" />
        <meta
          property="og:title"
          content="Hire.mn | Онлайн тест, хөндлөнгийн үнэлгээ"
        />
        <meta
          property="og:description"
          content="Онлайн тест, хөндлөнгийн үнэлгээний платформ"
        />
        <meta property="og:image" content="https://www.hire.mn/hire-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="mn_MN" />
        <meta property="og:site_name" content="Hire.mn" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.hire.mn" />
        <meta
          property="twitter:title"
          content="Hire.mn | Онлайн тест, хөндлөнгийн үнэлгээ"
        />
        <meta
          property="twitter:description"
          content="Онлайн тест, хөндлөнгийн үнэлгээний платформ"
        />
        <meta
          property="twitter:image"
          content="https://www.hire.mn/hire-logo.png"
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${gilroy.variable} ${geistMono.variable} antialiased`}>
        <Zoom />
        <Provider>
          {!hideNavbar && (
            <div className="fixed top-0 sm:top-4 w-full 2xl:px-72 xl:px-24 lg:px-16 md:px-12 z-[100]">
              <Navbar />
            </div>
          )}
          <div className={`relative ${!hideNavbar ? "top-16" : ""}`}>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
