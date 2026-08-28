import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "ProofChain Creative Provenance Registry";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // Fetch Google Sans Flex font from the Google Fonts API dynamically
  let fontData: ArrayBuffer | null = null;
  try {
    const cssResponse = await fetch(
      "https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;700&display=swap",
      {
        headers: {
          // Requesting ttf format specifically by mimicking an older Android device
          "User-Agent":
            "Mozilla/5.0 (Linux; U; Android 2.2) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        },
      }
    );
    const css = await cssResponse.text();
    const match = css.match(/src:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      const fontResponse = await fetch(match[1]);
      fontData = await fontResponse.arrayBuffer();
    }
  } catch (error) {
    console.error("Failed to load Google Sans Flex for OG image, falling back:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0B0D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: fontData ? "Google Sans Flex" : "sans-serif",
          color: "#F9FAFB",
          padding: "80px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              color: "#F9FAFB",
            }}
          >
            ProofChain
          </span>
          <div
            style={{
              background: "#14161A",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 400,
              color: "#60A5FA",
              letterSpacing: "0.05em",
            }}
          >
            ARBITRUM TESTNET
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "800px",
            marginTop: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: 0,
              color: "#F9FAFB",
            }}
          >
            Creative Provenance Registry
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 300,
              color: "#9CA3AF",
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            Secure decentralized provenance and automated royalty splits for creative assets
          </p>
        </div>

        {/* Bottom Feature Cards */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            width: "100%",
            marginTop: "40px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              flex: 1,
              background: "#14161A",
              padding: "24px 32px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#60A5FA",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Provenance Registry
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#9CA3AF",
                marginTop: "8px",
              }}
            >
              Anchor original works and track creative lineage records
            </span>
          </div>

          {/* Card 2 */}
          <div
            style={{
              flex: 1,
              background: "#14161A",
              padding: "24px 32px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#60A5FA",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Royalty Splits
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#9CA3AF",
                marginTop: "8px",
              }}
            >
              Execute trustless split payments directly on chain
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Google Sans Flex",
              data: fontData,
              style: "normal",
              weight: 400,
            },
          ]
        : [],
    }
  );
}
