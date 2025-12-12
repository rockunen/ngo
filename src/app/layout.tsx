import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Get Wish Foundation - NGO for Community Welfare",
  description:
    "Get Wish Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development initiatives across India.",
  keywords: "NGO, Non-profit, Community welfare, Education, Livelihood, India",
  authors: [{ name: "Get Wish Foundation" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
