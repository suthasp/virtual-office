import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Data Center Operations Virtual Office",
  description: "Enterprise-grade digital twin for data center operations management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.variable} font-sans bg-gray-950 text-white antialiased h-full`}>
        {children}
      </body>
    </html>
  );
}
