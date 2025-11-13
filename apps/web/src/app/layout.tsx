import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "./_components/site-header";
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
      <body className="bg-slate-950 text-slate-100">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
