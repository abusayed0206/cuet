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
  title: "CUET Students Directory | Find Peers and Alumni",
  description:
    "The official unofficial CUET Students Database. Search, filter, and discover student information, including ID, name, department, and batch for Chittagong University of Engineering & Technology.",
  keywords: [
    "CUET", "CUET Students", "CUET Directory", "Chittagong University of Engineering & Technology",
    "CUET Alumni", "CUET Batch", "Student Database", "Bangladesh Engineering University"
  ],
  authors: [{ name: "Sayed", url: "https://sayed.page/" }],
  creator: "Sayed",
  publisher: "Sayed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cuet.sayed.app/"),
  alternates: {
    canonical: '/',
  },
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
    title: "CUET Students Directory",
    description: "Search and discover CUET student information across all departments and batches.",
    url: "https://cuet.sayed.app/",
    siteName: "CUET Students Directory",
    images: [
      {
        url: "/OG.png",
        width: 1200,
        height: 630,
        alt: "CUET Students Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CUET Students Directory",
    description: "Search and discover CUET student information across all departments and batches.",
    creator: "@sayed",
    images: ["/OG.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
