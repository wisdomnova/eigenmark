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
        <span className="text-xl font-light tracking-tight text-text-primary">
          ProofChain
        </span>
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
      <div className="max-w-4xl mt-16 flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-brand font-normal mb-4">
          Digital media provenance protocol
        </span>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-text-primary leading-tight mb-6">
          Verifiable provenance and licensing for creative media
        </h1>
        <p className="text-base sm:text-lg font-light text-text-muted max-w-2xl leading-relaxed mb-8">
          Register assets, document creative lineage, establish permissions, and secure automated splits. ProofChain makes media licensing completely trustless.
        </p>

        {/* Call to Action Button */}
        <div className="flex items-center gap-4 mb-16">
          <button
            onClick={handleAction}
            className="px-8 py-3 text-base font-light text-background bg-brand hover:bg-text-primary hover:text-background transition-colors duration-200 rounded-full cursor-pointer"
          >
            {isConnected ? "Launch Application" : "Connect Web3 Wallet"}
          </button>
        </div>

        {/* Minimalist Visual Representation of Provenance */}
        <div className="w-full max-w-3xl bg-surface rounded-3xl p-8 flex flex-col items-center justify-center gap-8">
          <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-6">
            
            {/* Alice's Original Node */}
            <div className="w-64 bg-surface-active p-6 rounded-2xl text-left">
              <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
                Original Asset
              </span>
              <h3 className="text-lg font-light text-text-primary mb-1">
                Alice Creative Work
              </h3>
              <p className="text-xs font-mono text-text-muted truncate">
                0x7f23a91bc90d1f43a...
              </p>
              <div className="mt-4 flex justify-between items-center text-xs text-text-muted">
                <span>License: Commercial</span>
                <span className="text-success">Verified</span>
              </div>
            </div>

            {/* Lineage Connector Arrow */}
            <div className="w-16 h-8 flex items-center justify-center text-text-muted">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Bob's Derivative Node */}
            <div className="w-64 bg-surface-active p-6 rounded-2xl text-left">
              <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
                Derivative Remix
              </span>
              <h3 className="text-lg font-light text-text-primary mb-1">
                Bob Derivative Work
              </h3>
              <p className="text-xs font-mono text-text-muted truncate">
                0x91bc83af10df20c9...
              </p>
              <div className="mt-4 flex justify-between items-center text-xs text-text-muted">
                <span>Royalty Split: 10% Alice</span>
                <span className="text-brand">Active</span>
              </div>
            </div>

          </div>

          <div className="text-xs font-mono text-text-muted bg-surface-active/50 px-4 py-2 rounded-full">
            Smart contract settlement automatically executes payments
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
