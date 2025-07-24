import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Hind_Siliguri({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CUET Students Directory",
  description:
    "CUET Students Database - Search and find student information by ID, name, department and batch",
  metadataBase: new URL("https://cuet.sayed.app/"),
  icons: [
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
  ],
  openGraph: {
    images: "/OG.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 min-h-screen text-slate-800`}
      >
        <Navbar />
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
