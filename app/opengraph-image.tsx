import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProofChain - Creative Provenance Registry";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#0A0B0D",
          color: "#F9FAFB",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <path
                d="M 28 50 L 10 32 C 4 26 4 16 10 10 C 16 4 26 4 32 10 L 58 36 C 64 42 64 52 58 58 L 50 66"
                stroke="#60A5FA"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 72 50 L 90 68 C 96 74 96 84 90 90 C 84 96 74 96 68 90 L 42 64 C 36 58 36 48 42 42 L 50 34"
                stroke="#F9FAFB"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="50" r="8" fill="#60A5FA" />
            </svg>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 300,
                letterSpacing: "-0.5px",
                color: "#F9FAFB",
              }}
            >
              ProofChain
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 18px",
              borderRadius: "9999px",
              backgroundColor: "#14161A",
              color: "#60A5FA",
              fontSize: "12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Arbitrum Active
          </div>
        </div>

        {/* Center Content Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Feature Badges */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "#14161A",
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              01 Perceptual pHash
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "#14161A",
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              02 On Chain Splits
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "#14161A",
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              03 Model Context Protocol
            </div>
          </div>

          {/* Large Headline */}
          <div
            style={{
              fontSize: "58px",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>The machine verifiable</span>
            <span>
              rights layer built for <span style={{ color: "#60A5FA" }}>AI agents</span>
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: 300,
              color: "#9CA3AF",
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            Cryptographic provenance, perceptual image signatures, and automated smart contract licensing settlement.
          </div>
        </div>

        {/* Bottom Ledger Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "16px 24px",
            backgroundColor: "#14161A",
            borderRadius: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#60A5FA",
            }}
          >
            0x933e2acc3852590a954bea93b692802dae88aaa21ac40ddb1f81462cd2a6c79b
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: "#34D399",
              }}
            />
            <span style={{ fontSize: "13px", color: "#34D399" }}>
              Ledger Verified
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
