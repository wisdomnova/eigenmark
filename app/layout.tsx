import type { Metadata } from "next";
import { StateProvider } from "@/context/StateContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://eigenmark.vercel.app"),
  title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
  description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
  openGraph: {
    title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
    description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
    url: "https://eigenmark.vercel.app",
    siteName: "Eigenmark",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eigenmark - The machine verifiable rights layer built for AI agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
    description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
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
              "name": "Eigenmark",
              "url": "https://eigenmark.vercel.app",
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
