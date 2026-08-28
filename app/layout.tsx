import type { Metadata } from "next";
import { StateProvider } from "@/context/StateContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://proofchain-omega.vercel.app"),
  title: "ProofChain Creative Provenance Registry",
  description: "Secure decentralized provenance and automated royalty splits for creative assets",
  openGraph: {
    title: "ProofChain Creative Provenance Registry",
    description: "Secure decentralized provenance and automated royalty splits for creative assets",
    url: "https://proofchain-omega.vercel.app",
    siteName: "ProofChain",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofChain Creative Provenance Registry",
    description: "Secure decentralized provenance and automated royalty splits for creative assets",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ProofChain",
              "url": "https://proofchain-omega.vercel.app",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <StateProvider>{children}</StateProvider>
        <Analytics />
      </body>
    </html>
  );
}
