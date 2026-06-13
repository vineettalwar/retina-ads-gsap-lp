import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/lib/i18n";
import { RETINA_META } from "@/content/retina-fr";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: RETINA_META.title,
  description: RETINA_META.description,
  icons: {
    icon: [
      { url: "/seo/favicon.ico" },
      { url: "/seo/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <head>
        <link
          rel="preload"
          href="/images/hero-sequence/0001.jpg?v=20260416-r2"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body style={{ backgroundColor: "#0a0a0a", color: "#f0f0f0", margin: 0, padding: 0, overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
