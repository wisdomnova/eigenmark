import type { Metadata } from "next";
import { StateProvider } from "@/context/StateContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eigenmark.app"),
  title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
  description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
  keywords: [
    "Eigenmark",
    "AI Agents",
    "Model Context Protocol",
    "MCP Server",
    "Cryptographic Provenance",
    "Perceptual pHash",
    "Smart Contract Licensing",
    "Arbitrum Sepolia",
    "Digital Rights Management",
  ],
  authors: [{ name: "Eigenmark" }],
  creator: "Eigenmark",
  publisher: "Eigenmark",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
    description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
    url: "https://www.eigenmark.app",
    siteName: "Eigenmark",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eigenmark - The autonomous provenance and settlement protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eigenmark | Machine Verifiable Rights Layer for AI Agents",
    description: "Eigenmark registers creative assets, computes visual and cryptographic signatures, and exposes standard rights interfaces to AI agents using the Model Context Protocol.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://www.eigenmark.app",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.eigenmark.app/#website",
        "url": "https://www.eigenmark.app",
        "name": "Eigenmark",
        "description": "Machine verifiable rights and provenance layer for AI agents",
        "publisher": {
          "@id": "https://www.eigenmark.app/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.eigenmark.app/#organization",
        "name": "Eigenmark",
        "url": "https://www.eigenmark.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.eigenmark.app/logo.png",
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://www.eigenmark.app/#sitelinks",
        "name": "Eigenmark Services & Portal Navigation",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Register Work",
            "description": "Compute client-side cryptographic SHA-256 and visual pHash to register original assets",
            "url": "https://www.eigenmark.app/portal/register",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Verify Provenance",
            "description": "Verify authenticity, cryptographic fingerprint, and on-chain ancestry in real time",
            "url": "https://www.eigenmark.app/portal/verify",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Derive Work",
            "description": "Establish transparent derivative parent relationships and automated royalty split terms",
            "url": "https://www.eigenmark.app/portal/derive",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Lineage Graph",
            "description": "Interactive provenance tree mapping generational relationships between parent and derivative works",
            "url": "https://www.eigenmark.app/portal/graph",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Settlement Console",
            "description": "Automated smart contract licensing and split payment settlement on Arbitrum",
            "url": "https://www.eigenmark.app/portal/licensing",
          },
        ],
      },
    ],
  };

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
            __html: JSON.stringify(jsonLd),
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
