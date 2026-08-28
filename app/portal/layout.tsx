"use client";

import { useAppState } from "@/context/StateContext";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";
import { IconLock } from "@tabler/icons-react";

function PortalContent({ children }: { children: React.ReactNode }) {
  const { isConnected, connectWallet } = useAppState();

  const wallets = [
    { name: "MetaMask", role: "Alice (Creator)" },
    { name: "Coinbase Wallet", role: "Bob (Remixer)" },
    { name: "WalletConnect", role: "Charlie (Buyer)" },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-full max-w-sm bg-surface p-8 rounded-3xl flex flex-col items-center">
          {/* Lock Icon */}
          <div className="w-12 h-12 rounded-full bg-surface-active flex items-center justify-center text-brand mb-6">
            <IconLock size={20} strokeWidth={1.5} />
          </div>

          <h3 className="text-xl font-light text-text-primary tracking-tight mb-2">
            Access Restricted
          </h3>
          <p className="text-xs font-light text-text-muted mb-8 leading-relaxed max-w-xs">
            Please connect your Web3 wallet to authorize secure access to the creative registry and contract logs.
          </p>

          <div className="flex flex-col gap-2.5 w-full">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => connectWallet(wallet.name)}
                className="w-full py-4 px-4 bg-surface-active hover:bg-brand hover:text-background text-left text-xs font-light text-text-primary rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center"
              >
                <span>{wallet.name}</span>
                <span className="text-[9px] opacity-80 uppercase tracking-wider font-mono">
                  {wallet.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Portal Workspace Content area */}
      <main className="flex-1 ml-64 p-8 min-h-screen bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalContent>{children}</PortalContent>;
}
