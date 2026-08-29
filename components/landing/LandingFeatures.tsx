"use client";

export default function LandingFeatures() {
  const features = [
    {
      title: "Perceptual Visual Signatures",
      description:
        "Extract grayscale and DCT coefficients client side to compute a visual perceptual hash. Compare visual Hamming distances in SQL to alert creators of derivative uploads before anchoring records.",
      label: "Provenance Intelligence",
    },
    {
      title: "Stateless Agent Tools",
      description:
        "Expose registry access directly to autonomous workflows. AI agents query asset details, verify usage allowances, check parent origins, and prepare transaction calldata using the Model Context Protocol.",
      label: "Model Context Protocol",
    },
    {
      title: "On Chain Splits Settlement",
      description:
        "Enforce parent royalty splits directly in smart contract logic. Licensing payments trigger instant trustless transfers distributed directly on chain to parent and derivative wallets.",
      label: "EVM Smart Contract",
    },
  ];

  return (
    <div className="py-24 bg-background px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-wider text-brand font-normal mb-4 block">
            Protocol capabilities
          </span>
          <h2 className="text-3xl font-light text-text-primary tracking-tight">
            Designed for digital media ownership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-surface p-8 rounded-2xl flex flex-col justify-between h-72 transition-colors duration-200 hover:bg-surface-active cursor-pointer"
            >
              <div>
                <span className="text-xs font-mono text-brand mb-4 block">
                  {feature.label}
                </span>
                <h3 className="text-xl font-light text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm font-light text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="text-xs font-light text-brand mt-4 flex items-center gap-1">
                <span>Read details</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
