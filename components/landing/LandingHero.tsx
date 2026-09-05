"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import WalletModal from "@/components/ui/WalletModal";

interface LandingHeroProps {
  onEnterPortal: () => void;
}

export default function LandingHero({ onEnterPortal }: LandingHeroProps) {
  const router = useRouter();
  const { isConnected, connectWallet, currentUser, disconnectWallet } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = () => {
    if (isConnected) {
      router.push("/portal/register");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 bg-background min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="ProofChain Logo" className="w-6 h-6 rounded-lg" />
          <span className="text-xl font-light tracking-tight text-text-primary">
            ProofChain
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-normal text-brand uppercase block leading-none">
                  Wallet connected
                </span>
                <span className="text-[11px] font-mono text-text-muted mt-1 block">
                  {currentUser.address.substring(0, 6)}...{currentUser.address.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-4 py-1.5 text-xs font-light text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Disconnect
              </button>
              <button
                onClick={() => router.push("/portal/register")}
                className="px-6 py-2 text-sm font-light text-background bg-brand hover:bg-text-primary hover:text-background transition-colors duration-200 rounded-full cursor-pointer"
              >
                Enter Portal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 text-sm font-light text-text-primary bg-surface-active hover:bg-brand hover:text-background transition-colors duration-200 rounded-full cursor-pointer"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Hero Copy */}
      <div className="max-w-5xl mt-16 flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-brand font-normal mb-4">
          verifiable rights layer for digital content
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-tight mb-6">
          The machine verifiable rights layer built for AI agents
        </h1>
        <p className="text-sm sm:text-base font-light text-text-muted max-w-3xl leading-relaxed mb-8">
          ProofChain registers assets, computes visual and cryptographic signatures, uploads media to serverless storage, and exposes standard rights interfaces to AI agents using the Model Context Protocol.
        </p>

        {/* Call to Action Button */}
        <div className="flex items-center gap-4 mb-16">
          <button
            onClick={handleAction}
            className="px-8 py-3.5 text-xs uppercase tracking-wider font-mono text-background bg-brand hover:bg-text-primary hover:text-background transition-colors duration-200 rounded-full cursor-pointer"
          >
            {isConnected ? "Launch Portal Console" : "Connect Web3 Wallet"}
          </button>
        </div>

        {/* Minimalist Visual Representation of Provenance */}
        <div className="w-full max-w-4xl bg-surface rounded-3xl p-8 flex flex-col items-center justify-center gap-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Upload and Hash */}
            <div className="bg-surface-active p-6 rounded-2xl text-left flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand font-normal block mb-2 font-mono">
                  01 Media Hash
                </span>
                <h3 className="text-sm font-normal text-text-primary mb-1">
                  Local Perceptual Signatures
                </h3>
                <p className="text-[11px] font-light text-text-muted leading-relaxed">
                  Computes SHA 256 and visual pHash in browser. Uploads media to Supabase storage.
                </p>
              </div>
              <div className="text-[10px] font-mono text-success mt-4">
                Verify Complete
              </div>
            </div>

            {/* Step 2: Smart Contract Ledger */}
            <div className="bg-surface-active p-6 rounded-2xl text-left flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand font-normal block mb-2 font-mono">
                  02 Ledger Registry
                </span>
                <h3 className="text-sm font-normal text-text-primary mb-1">
                  Smart Contract Splits
                </h3>
                <p className="text-[11px] font-light text-text-muted leading-relaxed">
                  Solidity contracts automatically split licensing fees between parent and derivative creators.
                </p>
              </div>
              <div className="text-[10px] font-mono text-brand mt-4">
                Arbitrum Sepolia Active
              </div>
            </div>

            {/* Step 3: MCP Agent Interface */}
            <div className="bg-surface-active p-6 rounded-2xl text-left flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand font-normal block mb-2 font-mono">
                  03 Agent Access
                </span>
                <h3 className="text-sm font-normal text-text-primary mb-1">
                  Model Context Protocol
                </h3>
                <p className="text-[11px] font-light text-text-muted leading-relaxed">
                  Exposes stateless tools for AI agents to query provenance, verify rights, and settle royalties.
                </p>
              </div>
              <div className="text-[10px] font-mono text-text-muted mt-4">
                Stdio Server Ready
              </div>
            </div>

          </div>

          <div className="text-[10px] font-mono text-text-muted bg-surface-active/50 px-4 py-2 rounded-full mt-2">
            Verifiable provenance infrastructure enabling autonomous licensing settlement
          </div>
        </div>
      </div>

      {/* Wallet Connection Modal overlay */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={connectWallet}
      />
    </div>
  );
}
