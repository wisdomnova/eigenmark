"use client";

import { useState } from "react";
import { IconX } from "@tabler/icons-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletName: string) => void;
}

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [signingMessage, setSigningMessage] = useState(false);

  if (!isOpen) return null;

  const wallets = [
    { name: "MetaMask", role: "Alice (Creator)" },
    { name: "Coinbase Wallet", role: "Bob (Remixer)" },
    { name: "WalletConnect", role: "Charlie (Buyer)" },
  ];

  const handleWalletSelect = (walletName: string) => {
    setConnectingWallet(walletName);
    
    // Simulate wallet connection steps
    setTimeout(() => {
      setSigningMessage(true);
      
      // Simulate cryptographic message signing request
      setTimeout(() => {
        onConnect(walletName);
        setConnectingWallet(null);
        setSigningMessage(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0B0D]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-surface p-6 rounded-3xl relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={connectingWallet !== null}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <IconX size={16} />
        </button>

        {connectingWallet ? (
          <div className="flex flex-col items-center justify-center py-8 text-center min-h-[220px]">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent animate-spin rounded-full mb-6"></div>
            {signingMessage ? (
              <>
                <h3 className="text-base font-normal text-text-primary mb-2">
                  Signature Request
                </h3>
                <p className="text-xs font-light text-text-muted max-w-xs leading-relaxed">
                  Please sign the message in your wallet extension to authorize registration access.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-normal text-text-primary mb-2">
                  Connecting {connectingWallet}
                </h3>
                <p className="text-xs font-light text-text-muted">
                  Initializing cryptographic handshake sequence.
                </p>
              </>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-light text-text-primary tracking-tight mb-2">
              Connect Web3 Wallet
            </h3>
            <p className="text-xs font-light text-text-muted mb-6 leading-relaxed">
              Select your wallet provider to establish identity. For demonstration, each wallet acts as a different user.
            </p>

            <div className="flex flex-col gap-2">
              {wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
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
        )}
      </div>
    </div>
  );
}
