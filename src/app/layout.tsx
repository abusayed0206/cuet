import type { Metadata } from "next";
import { Nova_Square } from "next/font/google";
import "./globals.css";

const inter = Nova_Square({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayed",
  description: "Negative by Blood💖⭐, Just a Normie🙂.",
  metadataBase: new URL("https://sayed.page/"),
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "android-chrome",
      sizes: "192x192",
      url: "/android-chrome-192x192.png",
    },

    {
      rel: "safari-pinned-tab",
      sizes: "180x180",
      url: "/safari-pinned-tab.svg",
    },
  ],
  openGraph: {
    images: '/OG_Image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
