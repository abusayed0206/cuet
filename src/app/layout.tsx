import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Hind_Siliguri({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CUET STUDENTS API",
  description: "Negative by Blood💖⭐, Just a Normie🙂.",
  metadataBase: new URL("https://cuet.sayed.page/"),
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "https://sayed.page/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "https://sayed.page/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "https://sayed.page/apple-touch-icon.png",
    },
    {
      rel: "android-chrome",
      sizes: "192x192",
      url: "https://sayed.page/android-chrome-192x192.png",
    },

    {
      rel: "safari-pinned-tab",
      sizes: "180x180",
      url: "https://sayed.page/safari-pinned-tab.svg",
    },
  ],
  openGraph: {
    images: 'https://sayed.page/OG_Image.png',
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
