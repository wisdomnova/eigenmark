"use client";

import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

interface Asset {
  id: string;
  title: string;
  description: string;
  aiModel: string;
  contentHash: string;
  royaltySplit: number;
  creatorAddress: string;
  parentId?: string;
  timestamp: string;
  transactionHash: string;
}

interface LicensingAgreement {
  id: string;
  assetId: string;
  licenseeAddress: string;
  transactionHash: string;
  price: number;
  royaltySplit: number;
  timestamp: string;
}

interface LicensingConsoleProps {
  currentUser: { name: string; address: string; role: string };
  assets: Array<Asset>;
  agreements: Array<LicensingAgreement>;
  onBuyLicense: (agreement: {
    assetId: string;
    licenseeAddress: string;
    price: number;
    royaltySplit: number;
  }) => Promise<void>;
}

export default function LicensingConsole({
  currentUser,
  assets,
  agreements,
  onBuyLicense,
}: LicensingConsoleProps) {
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [price, setPrice] = useState(10); // Default $10 USDC
  const [logs, setLogs] = useState<Array<string>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Find derivative assets (those with parents)
  const derivatives = assets.filter((a) => a.parentId);

  const handlePurchase = async () => {
    if (!selectedAssetId) return;

    const selectedAsset = assets.find((a) => a.id === selectedAssetId);
    if (!selectedAsset) return;

    setIsProcessing(true);
    setLogs([
      "Connecting wallet and checking testnet USDC balance",
      "Please confirm the smart contract transaction in your wallet..."
    ]);
    
    try {
      await onBuyLicense({
        assetId: selectedAssetId,
        licenseeAddress: currentUser.address,
        price: price,
        royaltySplit: selectedAsset.royaltySplit,
      });
      
      setLogs((prev) => [
        ...prev,
        `Resolving parent royalty split of ${selectedAsset.royaltySplit}%`,
        `Transferring payment splits: ${price * (selectedAsset.royaltySplit / 100)} USDC to primary creator, ${price * (1 - selectedAsset.royaltySplit / 100)} USDC to derivative creator`,
        "Mining block and writing license record to the immutable ledger",
        "License purchase successful, event logs emitted",
      ]);
    } catch (error) {
      console.error("Purchase failed:", error);
      setLogs((prev) => [...prev, "Transaction rejected or failed."]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getParentCreatorName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset || !asset.parentId) return "Unknown";
    const parent = assets.find((p) => p.id === asset.parentId);
    return parent ? (parent.creatorAddress.substring(0, 6) === "0x1111" ? "Alice" : "Creator") : "Original";
  };

  const derivativeOptions = derivatives.map((asset) => ({
    value: asset.id,
    label: asset.title,
    sublabel: `${asset.contentHash.substring(0, 16)}...`,
  }));

  return (
    <div className="w-full max-w-3xl bg-surface p-8 rounded-3xl mx-auto my-12">
      <div className="mb-8 text-left">
        <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
          Automated smart contract settlement
        </span>
        <h2 className="text-2xl font-light text-text-primary tracking-tight">
          Settlement console
        </h2>
        <p className="text-xs font-light text-text-muted mt-1 leading-relaxed">
          License derivative creative works and watch the royalty splits execute automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buy Form */}
        <div className="text-left flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Dropdown
              options={derivativeOptions}
              value={selectedAssetId}
              onChange={setSelectedAssetId}
              label="Select Creative Work"
              placeholder="Select a derivative work"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-text-muted">
              Licensing Fee (USDC)
            </label>
            <input
              type="number"
              value={price}
              disabled
              className="w-full bg-surface-active/50 text-text-muted text-sm font-light h-12 px-4 rounded-xl outline-none border-none mt-1"
            />
            <span className="text-[10px] text-text-muted mt-1">
              Fixed licensing price for verification demo.
            </span>
          </div>

          {selectedAssetId && (
            <div className="bg-surface-active/40 p-4 rounded-xl text-xs font-light flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider text-brand font-normal mb-1 block">
                Expected settlement split
              </span>
              <div className="flex justify-between">
                <span>
                  Original creator ({getParentCreatorName(selectedAssetId)})
                </span>
                <span className="font-mono text-text-primary">
                  {price *
                    ((assets.find((a) => a.id === selectedAssetId)?.royaltySplit || 0) /
                      100)}{" "}
                  USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Derivative creator (Bob)</span>
                <span className="font-mono text-text-primary">
                  {price *
                    (1 -
                      (assets.find((a) => a.id === selectedAssetId)?.royaltySplit || 0) /
                        100)}{" "}
                  USDC
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={!selectedAssetId || isProcessing}
            className={`w-full py-4 text-sm font-normal text-background rounded-full transition-colors duration-200 cursor-pointer ${
              selectedAssetId && !isProcessing
                ? "bg-brand hover:bg-text-primary"
                : "bg-surface-active/50 text-text-muted cursor-not-allowed"
            }`}
          >
            {isProcessing ? "Processing split" : "Execute License Contract"}
          </button>
        </div>

        {/* Processing Logs */}
        <div className="bg-surface-active/30 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[300px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-normal block mb-4">
              Contract transaction telemetry
            </span>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-xs font-light text-text-muted max-w-[200px]">
                  Initiate a licensing contract on the left to watch live execution logs.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 font-mono text-[10px] leading-relaxed">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-brand">✓</span>
                    <span className="text-text-primary">{log}</span>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-2 items-center text-text-muted mt-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                    <span>Broadcasting events</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isProcessing && logs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-surface/50 text-xs font-light text-success flex flex-col gap-1">
              <span>Settlement confirmed</span>
              <span className="text-[9px] font-mono text-text-muted truncate">
                Tx: 0x{Math.random().toString(36).substring(2, 15)}...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Existing Agreements */}
      {agreements.length > 0 && (
        <div className="mt-12 text-left">
          <span className="text-xs uppercase tracking-wider text-text-muted block mb-4">
            Active licensing certificates
          </span>
          <div className="flex flex-col gap-3">
            {agreements.map((agreement) => {
              const asset = assets.find((a) => a.id === agreement.assetId);
              return (
                <div
                  key={agreement.id}
                  className="bg-surface-active/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light"
                >
                  <div>
                    <h4 className="text-sm font-normal text-text-primary">
                      {asset?.title || "Derivative Asset"}
                    </h4>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">
                      Licensee: {agreement.licenseeAddress}
                    </p>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-text-primary block font-mono">
                      {agreement.price} USDC
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      Split split settlement complete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
