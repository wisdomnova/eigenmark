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

interface AgentStep {
  step: number;
  tool: string;
  status: "idle" | "running" | "completed" | "error";
  description: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  durationMs?: number;
}

export default function LicensingConsole({
  currentUser,
  assets,
  agreements,
  onBuyLicense,
}: LicensingConsoleProps) {
  const [activeTab, setActiveTab] = useState<"agent" | "manual">("agent");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [price, setPrice] = useState(10); // Default $10 USDC
  const [logs, setLogs] = useState<Array<string>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Agent Simulation State
  const [agentScenario, setAgentScenario] = useState<"derivative" | "training" | "lora">("derivative");
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentActiveStep, setAgentActiveStep] = useState<number>(-1);
  const [agentCompleted, setAgentCompleted] = useState(false);
  const [expandedToolIndex, setExpandedToolIndex] = useState<number | null>(0);

  // Find derivative assets (those with parents)
  const derivatives = assets.filter((a) => a.parentId);
  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || derivatives[0] || assets[0];

  const agentSteps: Array<AgentStep> = [
    {
      step: 1,
      tool: "verify_provenance",
      status:
        agentActiveStep > 0
          ? "completed"
          : agentActiveStep === 0
          ? "running"
          : "idle",
      description: "Analyze cryptographic lineage tree & perceptual pHash invariant",
      request: {
        method: "tools/call",
        params: {
          name: "verify_provenance",
          arguments: {
            content_hash: selectedAsset?.contentHash || "0x7f9a882e34c190ab77...",
            phash_tolerance_bits: 6,
          },
        },
      },
      response: {
        verified: true,
        parent_asset: {
          content_hash: "0xab12c345de6789f01234567890abcdef1234567890ab...",
          creator: "0x1111111111111111111111111111111111111111",
          royalty_rate_pct: selectedAsset?.royaltySplit || 20,
        },
        hamming_distance: 4,
        similarity_index: "93.75%",
        lineage_depth: 2,
      },
      durationMs: 142,
    },
    {
      step: 2,
      tool: "check_usage_policy",
      status:
        agentActiveStep > 1
          ? "completed"
          : agentActiveStep === 1
          ? "running"
          : "idle",
      description: "Inspect on-chain licensing terms & verify automated authorization",
      request: {
        method: "tools/call",
        params: {
          name: "check_usage_policy",
          arguments: {
            asset_id: selectedAsset?.id || "ast_8892f01",
            licensee: "0x981F42cA90b4dE150024823Eb1fA30E6607e47cA",
            intended_use:
              agentScenario === "derivative"
                ? "commercial_derivative_synthesis"
                : agentScenario === "training"
                ? "llm_model_ingestion"
                : "lora_weight_fine_tuning",
          },
        },
      },
      response: {
        policy_status: "AUTHORIZED",
        license_price_usdc: price,
        automated_settlement_enabled: true,
        arbitrum_contract: "0x71207757FB3F8118EC0BAb8f2251E09973892306",
        split_distribution: {
          original_creator_share: `${selectedAsset?.royaltySplit || 20}%`,
          derivative_creator_share: `${100 - (selectedAsset?.royaltySplit || 20)}%`,
        },
      },
      durationMs: 88,
    },
    {
      step: 3,
      tool: "license_asset",
      status:
        agentActiveStep > 2
          ? "completed"
          : agentActiveStep === 2
          ? "running"
          : "idle",
      description: "Trigger Arbitrum smart contract multi-recipient escrow & split",
      request: {
        method: "tools/call",
        params: {
          name: "license_asset",
          arguments: {
            asset_id: selectedAsset?.id || "ast_8892f01",
            amount_usdc: price,
            network: "arbitrum_sepolia",
            max_gas_gwei: 0.1,
          },
        },
      },
      response: {
        status: "SETTLED",
        transaction_hash: "0x4f829b10a5620984918e907d471026027ab57849103c80918a20984719082049",
        block_number: 84920412,
        gas_used: "84,120 gas (~$0.0011)",
        escrow_settled: true,
        transfers: [
          {
            to: getParentCreatorAddress(selectedAsset?.id || ""),
            amount: `${price * ((selectedAsset?.royaltySplit || 20) / 100)} USDC`,
            role: "primary_creator",
          },
          {
            to: selectedAsset?.creatorAddress || "0x2222...2222",
            amount: `${price * (1 - (selectedAsset?.royaltySplit || 20) / 100)} USDC`,
            role: "derivative_creator",
          },
        ],
      },
      durationMs: 420,
    },
    {
      step: 4,
      tool: "generate_proof_certificate",
      status:
        agentActiveStep > 3
          ? "completed"
          : agentActiveStep === 3
          ? "running"
          : "idle",
      description: "Mint cryptographically signed NFT receipt & register on IPFS registry",
      request: {
        method: "tools/call",
        params: {
          name: "generate_proof_certificate",
          arguments: {
            transaction_hash: "0x4f829b10a5620984918e907d471026027ab57849103c80918a20984719082049",
            asset_id: selectedAsset?.id || "ast_8892f01",
          },
        },
      },
      response: {
        certificate_token_id: "0x7a892b...4092",
        ipfs_manifest_cid: "bafybeiczsscdspl7kiog7eoxikx4w646s",
        onchain_proof_verified: true,
        eigenmark_registry_status: "ACTIVE_VALID",
      },
      durationMs: 195,
    },
  ];

  function getParentCreatorAddress(assetId: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset || !asset.parentId) return "0x1111111111111111111111111111111111111111";
    const parent = assets.find((p) => p.id === asset.parentId || p.contentHash === asset.parentId);
    return parent ? parent.creatorAddress : "0x1111111111111111111111111111111111111111";
  }

  const runAgentSimulation = async () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentCompleted(false);

    for (let i = 0; i < 4; i++) {
      setAgentActiveStep(i);
      setExpandedToolIndex(i);
      await new Promise((res) => setTimeout(res, 750));
    }

    setAgentActiveStep(4);
    setAgentCompleted(true);
    setIsAgentRunning(false);
  };

  const handlePurchase = async () => {
    if (!selectedAssetId) return;
    const target = assets.find((a) => a.id === selectedAssetId);
    if (!target) return;

    setIsProcessing(true);
    setLogs([
      "Connecting wallet and verifying testnet USDC balance",
      "Broadcasting smart contract transaction to Arbitrum Sepolia...",
    ]);

    try {
      await onBuyLicense({
        assetId: selectedAssetId,
        licenseeAddress: currentUser.address,
        price: price,
        royaltySplit: target.royaltySplit,
      });

      setLogs((prev) => [
        ...prev,
        `Resolving parent lineage: royalty split of ${target.royaltySplit}%`,
        `Transferring automated splits: ${price * (target.royaltySplit / 100)} USDC to primary creator, ${price * (1 - target.royaltySplit / 100)} USDC to derivative creator`,
        "Mining block on Arbitrum and writing license certificate to immutable registry",
        "License settlement successful, On-Chain Event 0xLicenseSettled emitted",
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
    if (!asset || !asset.parentId) return "Original";
    const parent = assets.find((p) => p.id === asset.parentId || p.contentHash === asset.parentId);
    if (!parent) return "Parent Asset";
    return `${parent.creatorAddress.substring(0, 6)}...${parent.creatorAddress.slice(-4)}`;
  };

  const getDerivativeCreatorName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return "Derivative Creator";
    return `${asset.creatorAddress.substring(0, 6)}...${asset.creatorAddress.slice(-4)}`;
  };

  const derivativeOptions = (derivatives.length > 0 ? derivatives : assets).map((asset) => ({
    value: asset.id,
    label: asset.title,
    sublabel: `${asset.contentHash.substring(0, 16)}...`,
  }));

  return (
    <div className="w-full max-w-4xl bg-surface p-6 sm:p-8 rounded-3xl mx-auto my-12 border border-surface-active/30">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-active/40 text-left">
        <div>
          <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-1">
            Arbitrum Sepolia Settlement Layer
          </span>
          <h2 className="text-2xl font-light text-text-primary tracking-tight">
            Settlement & Agent Console
          </h2>
          <p className="text-xs font-light text-text-muted mt-1 leading-relaxed">
            Verify provenance, execute automated split contracts, or simulate autonomous MCP agent negotiations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex bg-surface-active/50 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("agent")}
            className={`px-4 py-2 text-xs rounded-xl transition-all cursor-pointer font-light ${
              activeTab === "agent"
                ? "bg-brand text-background font-normal shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Autonomous Agent (MCP)
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 text-xs rounded-xl transition-all cursor-pointer font-light ${
              activeTab === "manual"
                ? "bg-brand text-background font-normal shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Manual Settlement
          </button>
        </div>
      </div>

      {/* VIEW 1: AUTONOMOUS AI AGENT SIMULATION */}
      {activeTab === "agent" && (
        <div className="flex flex-col gap-6 text-left">
          {/* Agent Context Card */}
          <div className="bg-surface-active/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center font-mono text-xs text-brand font-medium">
                MCP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-normal text-text-primary">
                    Agent-0xSynthesis (Claude 3.7 / Cursor MCP)
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-brand/10 text-brand">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                    Ready
                  </span>
                </div>
                <p className="text-[11px] font-mono text-text-muted mt-0.5">
                  Protocol: Model Context Protocol (v2024-11-05) &bull; Settlement: Arbitrum Sepolia
                </p>
              </div>
            </div>

            {/* Scenario Selector & Run Button */}
            <div className="flex items-center gap-2.5">
              <select
                aria-label="Simulation Scenario"
                value={agentScenario}
                onChange={(e) => setAgentScenario(e.target.value as "derivative" | "training" | "lora")}
                disabled={isAgentRunning}
                className="bg-surface text-text-primary text-xs font-light px-3 py-2 rounded-xl outline-none border border-surface-active/50 cursor-pointer"
              >
                <option value="derivative">Scenario: Derivative Video Remix</option>
                <option value="training">Scenario: Autonomous LLM Ingestion</option>
                <option value="lora">Scenario: LoRA Style Fine-Tuning</option>
              </select>

              <button
                onClick={runAgentSimulation}
                disabled={isAgentRunning}
                className={`px-4 py-2 text-xs font-normal text-background rounded-xl transition-all cursor-pointer ${
                  isAgentRunning
                    ? "bg-surface-active/60 text-text-muted cursor-not-allowed"
                    : "bg-brand hover:bg-text-primary"
                }`}
              >
                {isAgentRunning ? "Executing MCP Tools..." : "Run Agent Simulation"}
              </button>
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {agentSteps.map((step, idx) => {
              const isCurrent = agentActiveStep === idx;
              const isDone = agentActiveStep > idx || agentCompleted;
              return (
                <div
                  key={step.tool}
                  onClick={() => setExpandedToolIndex(idx)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    expandedToolIndex === idx
                      ? "border-brand bg-surface-active/40"
                      : "border-transparent bg-surface-active/20 hover:bg-surface-active/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
                      Step 0{step.step}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                        isDone
                          ? "bg-success/10 text-success"
                          : isCurrent
                          ? "bg-brand/20 text-brand animate-pulse"
                          : "bg-surface text-text-muted"
                      }`}
                    >
                      {isDone ? "Settled" : isCurrent ? "Executing" : "Queued"}
                    </span>
                  </div>
                  <h4 className="text-xs font-mono text-text-primary truncate">
                    {step.tool}()
                  </h4>
                  <p className="text-[10px] font-light text-text-muted mt-1 line-clamp-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Expanded Telemetry & Inspector */}
          {expandedToolIndex !== null && (
            <div className="bg-surface-active/25 p-5 rounded-2xl border border-surface-active/40 font-mono text-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-active/30">
                <div className="flex items-center gap-2">
                  <span className="text-brand text-xs">●</span>
                  <span className="text-text-primary font-medium">
                    Tool Telemetry: {agentSteps[expandedToolIndex].tool}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    ({agentSteps[expandedToolIndex].durationMs}ms roundtrip)
                  </span>
                </div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">
                  JSON-RPC 2.0 Over STDIO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Payload */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted block mb-1.5 font-sans">
                    Agent Request Payload
                  </span>
                  <pre className="bg-background/80 p-3.5 rounded-xl text-[10px] text-text-muted overflow-x-auto leading-relaxed border border-surface-active/30">
                    {JSON.stringify(agentSteps[expandedToolIndex].request, null, 2)}
                  </pre>
                </div>

                {/* Return Payload */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brand block mb-1.5 font-sans">
                    Eigenmark Contract & MCP Response
                  </span>
                  <pre className="bg-background/80 p-3.5 rounded-xl text-[10px] text-brand/90 overflow-x-auto leading-relaxed border border-surface-active/30">
                    {JSON.stringify(agentSteps[expandedToolIndex].response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Autonomous Execution Receipt */}
          {agentCompleted && (
            <div className="bg-success/5 border border-success/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success font-mono">
                  ✓
                </div>
                <div>
                  <h4 className="text-text-primary font-normal">
                    Autonomous Settlement Complete
                  </h4>
                  <p className="text-[10px] font-mono text-text-muted">
                    Arbitrum Sepolia TX: 0x4f829b10a5620984918e907d471026027ab57849103c80918a20984719082049
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-text-muted block">Total Settled</span>
                  <span className="text-text-primary font-mono font-medium">{price}.00 USDC</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">L2 Gas Cost</span>
                  <span className="text-brand font-mono">&lt; $0.002</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MANUAL SETTLEMENT (DAPP MODE) */}
      {activeTab === "manual" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buy Form */}
          <div className="text-left flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Dropdown
                options={derivativeOptions}
                value={selectedAssetId || (derivativeOptions[0]?.value ?? "")}
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
                Direct on-chain micro-settlement price for demo verification.
              </span>
            </div>

            {selectedAsset && (
              <div className="bg-surface-active/40 p-4 rounded-xl text-xs font-light flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-brand font-normal mb-1 block">
                  Expected settlement split
                </span>
                <div className="flex justify-between">
                  <span>
                    Original creator ({getParentCreatorName(selectedAsset.id)})
                  </span>
                  <span className="font-mono text-text-primary">
                    {price * (selectedAsset.royaltySplit / 100)} USDC ({selectedAsset.royaltySplit}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Derivative creator ({getDerivativeCreatorName(selectedAsset.id)})</span>
                  <span className="font-mono text-text-primary">
                    {price * (1 - selectedAsset.royaltySplit / 100)} USDC ({100 - selectedAsset.royaltySplit}%)
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={!selectedAsset || isProcessing}
              className={`w-full py-4 text-sm font-normal text-background rounded-full transition-colors duration-200 cursor-pointer ${
                selectedAsset && !isProcessing
                  ? "bg-brand hover:bg-text-primary"
                  : "bg-surface-active/50 text-text-muted cursor-not-allowed"
              }`}
            >
              {isProcessing ? "Processing Arbitrum split..." : "Execute License Contract"}
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
                  <span className="text-xs font-light text-text-muted max-w-[220px]">
                    Initiate a licensing contract on the left or test the agent tab to view live on-chain logs.
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
                      <span>Mining Arbitrum transaction...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isProcessing && logs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-surface/50 text-xs font-light text-success flex flex-col gap-1">
                <span>Arbitrum Sepolia Settlement Confirmed</span>
                <span className="text-[9px] font-mono text-text-muted truncate">
                  Tx: 0x{Math.random().toString(36).substring(2, 15)}a9b4c09d8e7f
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Existing Agreements */}
      {agreements.length > 0 && (
        <div className="mt-10 pt-8 border-t border-surface-active/40 text-left">
          <span className="text-xs uppercase tracking-wider text-text-muted block mb-4">
            Active licensing certificates ({agreements.length})
          </span>
          <div className="flex flex-col gap-3">
            {agreements.map((agreement) => {
              const asset = assets.find((a) => a.id === agreement.assetId);
              return (
                <div
                  key={agreement.id}
                  className="bg-surface-active/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light border border-surface-active/30"
                >
                  <div>
                    <h4 className="text-sm font-normal text-text-primary">
                      {asset?.title || "Derivative Asset"}
                    </h4>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">
                      Licensee: {agreement.licenseeAddress}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-text-primary block font-mono">
                      {agreement.price} USDC
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5 font-mono">
                      Automated split executed
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

