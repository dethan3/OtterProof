import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "OtterProof — Data Validation Layer",
  description: "Upload datasets, validate quality, and anchor reports on Sui + Walrus.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
