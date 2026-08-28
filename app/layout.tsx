import type { Metadata } from "next";
import { StateProvider } from "@/context/StateContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProofChain",
  description: "Verifiable provenance and licensing for creative media",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <StateProvider>{children}</StateProvider>
        <Analytics />
      </body>
    </html>
  );
}
