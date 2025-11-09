import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Moved - CUET Directory",
  description: "This website has moved to https://cuet.sayed.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
