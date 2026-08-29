"use client";

import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import { useConnect } from "wagmi";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connectorOrName: any) => void;
}

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const { connectors } = useConnect();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [signingMessage, setSigningMessage] = useState(false);

  if (!isOpen) return null;

  const mockProfiles = [
    { name: "MetaMask", role: "Alice (Creator Profile)" },
    { name: "Coinbase Wallet", role: "Bob (Remixer Profile)" },
    { name: "WalletConnect", role: "Charlie (Buyer Profile)" },
  ];

  const handleWalletSelect = (connectorOrName: any) => {
    if (connectorOrName && typeof connectorOrName === "object" && connectorOrName.connect) {
      setConnectingWallet(connectorOrName.name);
      onConnect(connectorOrName);
      setConnectingWallet(null);
      onClose();
      return;
    }

    const name = String(connectorOrName);
    setConnectingWallet(name);
    
    // Simulate wallet connection steps for sandbox mocks
    setTimeout(() => {
      setSigningMessage(true);
      
      // Simulate cryptographic message signing request
      setTimeout(() => {
        onConnect(name);
        setConnectingWallet(null);
        setSigningMessage(false);
        onClose();
      }, 1200);
    }, 800);
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
              Select your wallet provider to establish identity.
            </p>

            {/* Live Connectors */}
            <div className="mb-4">
              <div className="text-[10px] font-normal uppercase tracking-wider text-text-muted mb-2">
                Live Wallet Connection
              </div>
              <div className="flex flex-col gap-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleWalletSelect(connector)}
                    className="w-full py-3.5 px-4 bg-surface-active hover:bg-brand hover:text-background text-left text-xs font-light text-text-primary rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center"
                  >
                    <span>{connector.name}</span>
                    <span className="text-[9px] opacity-80 uppercase tracking-wider font-mono">
                      Live
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-surface-active my-4"></div>

            {/* Sandbox Mocks */}
            <div>
              <div className="text-[10px] font-normal uppercase tracking-wider text-text-muted mb-2">
                Simulated Testing Profiles
              </div>
              <div className="flex flex-col gap-2">
                {mockProfiles.map((profile) => (
                  <button
                    key={profile.name}
                    onClick={() => handleWalletSelect(profile.name)}
                    className="w-full py-3.5 px-4 bg-surface-active hover:bg-brand hover:text-background text-left text-xs font-light text-text-primary rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center"
                  >
                    <span>{profile.name}</span>
                    <span className="text-[9px] opacity-80 uppercase tracking-wider font-mono">
                      {profile.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
