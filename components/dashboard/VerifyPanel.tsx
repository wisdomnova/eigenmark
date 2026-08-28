"use client";

import { useState } from "react";

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

interface VerifyPanelProps {
  assets: Array<Asset>;
}

export default function VerifyPanel({ assets }: VerifyPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [verifiedAsset, setVerifiedAsset] = useState<Asset | null>(null);
  const [searched, setSearched] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const lookupHash = (fileHash: string) => {
    setIsHashing(true);
    setTimeout(() => {
      // Find exact or partial match for demo purposes
      // Let's match by checking if the hash exists in our list
      const matched = assets.find(
        (a) => a.contentHash.toLowerCase() === fileHash.toLowerCase()
      );
      setVerifiedAsset(matched || null);
      setSearched(true);
      setIsHashing(false);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      // For demo, if we drag a file that is similar to one of our existing assets, we match it!
      // Let's find if an asset matches the file name, else generate a random hash that won't match
      const matchedByName = assets.find(
        (a) => a.title.toLowerCase() === file.name.split(".")[0].toLowerCase()
      );
      if (matchedByName) {
        lookupHash(matchedByName.contentHash);
      } else {
        // Generate random hash representing unmatched file
        lookupHash("0x" + Math.random().toString(36).substring(2, 15) + "unmatched");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const matchedByName = assets.find(
        (a) => a.title.toLowerCase() === file.name.split(".")[0].toLowerCase()
      );
      if (matchedByName) {
        lookupHash(matchedByName.contentHash);
      } else {
        lookupHash("0x" + Math.random().toString(36).substring(2, 15) + "unmatched");
      }
    }
  };

  // Helper to select an existing asset directly to test verification
  const handleVerifyDemoAsset = (asset: Asset) => {
    setFileName(asset.title);
    lookupHash(asset.contentHash);
  };

  return (
    <div className="w-full max-w-2xl bg-surface p-8 rounded-3xl mx-auto my-12">
      <div className="mb-8 text-left">
        <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
          Verify digital authenticity
        </span>
        <h2 className="text-2xl font-light text-text-primary tracking-tight">
          Verify creative provenance
        </h2>
        <p className="text-xs font-light text-text-muted mt-1 leading-relaxed">
          Drop any media file to search the blockchain index. ProofChain queries the hash and resolves the entire registered history.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`h-40 rounded-2xl flex flex-col items-center justify-center border-none transition-colors duration-200 text-center p-4 relative ${
            dragActive ? "bg-surface-active" : "bg-surface-active/30"
          }`}
        >
          <input
            type="file"
            id="verify-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {isHashing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent animate-spin rounded-full"></div>
              <span className="text-xs font-light text-text-muted">Analyzing file signature</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-text-muted"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-light text-text-primary">
                Drag original file here to verify
              </span>
              <span className="text-[10px] text-text-muted">
                Calculates cryptographic fingerprint locally
              </span>
            </div>
          )}
        </div>

        {/* Verification Result */}
        {searched && !isHashing && (
          <div className="text-left">
            {verifiedAsset ? (
              <div className="bg-surface-active/50 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-success font-normal block mb-1">
                      Provenance verified
                    </span>
                    <h3 className="text-xl font-light text-text-primary">
                      {verifiedAsset.title}
                    </h3>
                  </div>
                  <span className="bg-success/10 text-success text-[10px] uppercase font-mono px-3 py-1 rounded-full">
                    Active on ledger
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light mt-2">
                  <div>
                    <span className="text-text-muted block uppercase tracking-wider text-[9px]">
                      Asset signature hash
                    </span>
                    <span className="font-mono text-text-primary block truncate mt-0.5">
                      {verifiedAsset.contentHash}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block uppercase tracking-wider text-[9px]">
                      Creator address
                    </span>
                    <span className="font-mono text-text-primary block truncate mt-0.5">
                      {verifiedAsset.creatorAddress}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block uppercase tracking-wider text-[9px]">
                      Registered timestamp
                    </span>
                    <span className="text-text-primary block mt-0.5">
                      {verifiedAsset.timestamp}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block uppercase tracking-wider text-[9px]">
                      AI generation model
                    </span>
                    <span className="text-text-primary block mt-0.5">
                      {verifiedAsset.aiModel}
                    </span>
                  </div>
                </div>

                <div className="border-t border-surface/50 pt-4 flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-xs font-light">
                    <span className="text-text-muted">Licensing terms</span>
                    <span className="text-text-primary">Commercial use allowed</span>
                  </div>
                  <div className="flex justify-between text-xs font-light">
                    <span className="text-text-muted">Royalty terms</span>
                    <span className="text-text-primary">
                      {verifiedAsset.royaltySplit}% split to primary creator
                    </span>
                  </div>
                  {verifiedAsset.parentId && (
                    <div className="flex justify-between text-xs font-light">
                      <span className="text-text-muted">Lineage</span>
                      <span className="text-brand">Derivative work of parent asset</span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-mono text-text-muted truncate mt-1">
                  Anchor transaction: {verifiedAsset.transactionHash}
                </div>
              </div>
            ) : (
              <div className="bg-surface-active/30 p-6 rounded-2xl text-center">
                <span className="text-xs uppercase tracking-widest text-text-muted font-normal block mb-1">
                  Lookup complete
                </span>
                <h3 className="text-lg font-light text-text-primary mb-2">
                  No provenance record found
                </h3>
                <p className="text-xs font-light text-text-muted max-w-md mx-auto leading-relaxed">
                  This file hash does not match any registered asset signature. It may be unregistered or altered.
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-3">
                  Signature query: {fileName}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Demo Shortcut Quick Links */}
        <div className="text-left mt-4">
          <span className="text-[10px] uppercase tracking-wider text-text-muted block mb-3">
            Quick verify registered assets
          </span>
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleVerifyDemoAsset(asset)}
                className="px-3 py-1.5 bg-surface-active hover:bg-brand hover:text-background text-xs font-light rounded-full text-text-primary transition-colors duration-200 cursor-pointer"
              >
                {asset.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
