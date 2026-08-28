import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StateProvider } from "@/context/StateContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProofChain",
  description: "Verifiable provenance and licensing for creative media",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StateProvider>{children}</StateProvider>
        <Analytics />
      </body>
    </html>
  );
}
