import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./layout-client";
import Script from "next/script";

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

export const metadata = {
  metadataBase: new URL("https://hire.mn"),
  title: {
    default: "Hire.mn: Зөв хүн, зөв газарт",
    template: "%s / Hire.mn",
  },
  description: "Онлайн тест, хөндлөнгийн үнэлгээ",
  keywords: [
    "онлайн тест",
    "үнэлгээ",
    "тест",
    "hire",
    "zangia",
    "сорил",
    "iq",
    "логик",
  ],
  authors: [{ name: "Hire.mn" }],
  creator: "Hire.mn",
  publisher: "Hire.mn",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Hire.mn: Зөв хүн, зөв газарт",
    description: "Онлайн тест, хөндлөнгийн үнэлгээ",
    url: "https://hire.mn",
    siteName: "Hire.mn: Зөв хүн, зөв газарт",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: "https://hire.mn/misc.png",
        width: 1200,
        height: 630,
        alt: "Hire.mn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire.mn",
    description: "Онлайн тест, хөндлөнгийн үнэлгээ",
    images: ["https://hire.mn/misc.png"],
  },
  icons: {
    icon: "/profile.png",
    // apple: '/apple-touch-icon.png',
  },

  alternates: {
    canonical: "https://hire.mn",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-0B73T8TC20"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());

            gtag('config', 'G-0B73T8TC20');
          `}
        </Script>
      </head>
      <body className={`${gilroy.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
