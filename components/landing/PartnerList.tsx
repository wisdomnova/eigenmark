"use client";

export default function PartnerList() {
  const partners = [
    "Ethereum Testnet",
    "OpenAI Models",
    "Creative Commons",
    "Arbitrum Sepolia",
    "Base Network",
  ];

  return (
    <div className="py-12 bg-background border-t border-transparent text-center px-6">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-text-muted font-normal block mb-6">
          Supported platforms and testnets
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {partners.map((partner, index) => (
            <span
              key={index}
              className="text-sm font-light text-text-muted tracking-wide transition-colors duration-200 hover:text-text-primary cursor-pointer"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
