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

interface ProvenanceGraphProps {
  assets: Array<Asset>;
}

export default function ProvenanceGraph({ assets }: ProvenanceGraphProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(
    assets.length > 0 ? assets[0] : null
  );

  // Group assets into parents and children for simple rendering
  const parentAssets = assets.filter((a) => !a.parentId);
  const childAssets = assets.filter((a) => a.parentId);

  return (
    <div className="w-full max-w-5xl bg-surface p-8 rounded-3xl mx-auto my-12">
      <div className="mb-8 text-left">
        <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
          Asset lineage tracking
        </span>
        <h2 className="text-2xl font-light text-text-primary tracking-tight">
          Lineage network graph
        </h2>
        <p className="text-xs font-light text-text-muted mt-1 leading-relaxed">
          Explore relationships between original assets and derivative works. Click any node to inspect on chain metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-2 bg-surface-active/20 rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {assets.length === 0 ? (
            <span className="text-sm font-light text-text-muted">
              No registered assets to map. Use the registration tabs to add data.
            </span>
          ) : (
            <svg width="100%" height="380" className="max-w-full">
              {/* Define markers for arrowheads without hyphens in IDs */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#60A5FA" />
                </marker>
              </defs>

              {/* Draw connection lines between parents and their children */}
              {childAssets.map((child, idx) => {
                const parentIdx = parentAssets.findIndex((p) => p.id === child.parentId);
                if (parentIdx === -1) return null;

                // Simple layout math
                const startX = 140;
                const startY = 60 + parentIdx * 100;
                const endX = 360;
                const endY = 60 + idx * 100;

                return (
                  <path
                    key={`line-${child.id}`}
                    d={`M ${startX + 100} ${startY} C ${startX + 200} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke="#1E2127"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                  />
                );
              })}

              {/* Draw Parent Nodes (Left Column) */}
              {parentAssets.map((asset, index) => {
                const x = 140;
                const y = 60 + index * 100;
                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <g
                    key={asset.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <rect
                      x={x - 100}
                      y={y - 30}
                      width="200"
                      height="60"
                      rx="16"
                      fill={isSelected ? "#1E2127" : "#14161A"}
                      stroke={isSelected ? "#60A5FA" : "none"}
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={y - 5}
                      textAnchor="middle"
                      fill="#F9FAFB"
                      fontSize="12"
                      fontWeight="300"
                    >
                      {asset.title}
                    </text>
                    <text
                      x={x}
                      y={y + 15}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {asset.contentHash.substring(0, 10)}...
                    </text>
                  </g>
                );
              })}

              {/* Draw Child Nodes (Right Column) */}
              {childAssets.map((asset, index) => {
                const x = 360;
                const y = 60 + index * 100;
                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <g
                    key={asset.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <rect
                      x={x}
                      y={y - 30}
                      width="200"
                      height="60"
                      rx="16"
                      fill={isSelected ? "#1E2127" : "#14161A"}
                      stroke={isSelected ? "#60A5FA" : "none"}
                      strokeWidth="1"
                    />
                    <text
                      x={x + 100}
                      y={y - 5}
                      textAnchor="middle"
                      fill="#F9FAFB"
                      fontSize="12"
                      fontWeight="300"
                    >
                      {asset.title}
                    </text>
                    <text
                      x={x + 100}
                      y={y + 15}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {asset.contentHash.substring(0, 10)}...
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Selected Node details Panel */}
        <div className="bg-surface-active/30 p-6 rounded-2xl text-left h-fit">
          <span className="text-[10px] uppercase tracking-widest text-brand font-normal block mb-4">
            Metadata registry card
          </span>

          {selectedAsset ? (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-light text-text-primary">
                  {selectedAsset.title}
                </h3>
                <span className="text-[10px] font-mono text-text-muted truncate block mt-0.5">
                  ID: {selectedAsset.id}
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-2 text-xs font-light">
                <div>
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">
                    Creative description
                  </span>
                  <p className="text-text-primary mt-0.5 leading-relaxed">
                    {selectedAsset.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">
                    Calculated fingerprint
                  </span>
                  <span className="font-mono text-text-primary block truncate mt-0.5">
                    {selectedAsset.contentHash}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">
                    Creator wallet
                  </span>
                  <span className="font-mono text-text-primary block truncate mt-0.5">
                    {selectedAsset.creatorAddress}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">
                    Generation system
                  </span>
                  <span className="text-text-primary block mt-0.5">
                    {selectedAsset.aiModel}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[9px] uppercase tracking-wider">
                    Registration timestamp
                  </span>
                  <span className="text-text-primary block mt-0.5">
                    {selectedAsset.timestamp}
                  </span>
                </div>

                <div className="border-t border-surface/50 pt-3 mt-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Royalty split</span>
                    <span className="text-brand">{selectedAsset.royaltySplit}% split</span>
                  </div>
                  {selectedAsset.parentId && (
                    <div className="flex justify-between mt-1">
                      <span className="text-text-muted">Relationship</span>
                      <span className="text-success">Derivative link verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs font-light text-text-muted">
              Select a node in the graph to view on chain details.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
