"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { WagmiProvider, useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/context/wagmi";
import { contractAddress, contractAbi } from "@/context/contract";
import { parseEther } from "viem";

export interface Asset {
  id: string;
  title: string;
  description: string;
  aiModel: string;
  contentHash: string;
  royaltySplit: number;
  creatorAddress: string;
  parentId?: string;
  phash?: string;
  timestamp: string;
  transactionHash: string;
}

export interface LicensingAgreement {
  id: string;
  assetId: string;
  licenseeAddress: string;
  transactionHash: string;
  price: number;
  royaltySplit: number;
  timestamp: string;
}

export interface User {
  name: string;
  address: string;
  role: string;
}

interface StateContextType {
  users: Array<User>;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  assets: Array<Asset>;
  agreements: Array<LicensingAgreement>;
  isConnected: boolean;
  connectWallet: (walletName: string) => void;
  disconnectWallet: () => void;
  registerAsset: (asset: {
    title: string;
    description: string;
    aiModel: string;
    contentHash: string;
    royaltySplit: number;
    creatorAddress: string;
    parentId?: string;
    phash?: string;
  }) => Promise<string>;
  buyLicense: (agreement: {
    assetId: string;
    licenseeAddress: string;
    price: number;
    royaltySplit: number;
  }) => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);
const queryClient = new QueryClient();

function StateProviderContent({ children }: { children: ReactNode }) {
  const users: Array<User> = [
    { name: "Alice", address: "0x1111111111111111111111111111111111111111", role: "Creator" },
    { name: "Bob", address: "0x2222222222222222222222222222222222222222", role: "Remixer" },
    { name: "Charlie", address: "0x3333333333333333333333333333333333333333", role: "Buyer" },
  ];

  const [currentUserMock, setCurrentUserMock] = useState<User>(users[0]);
  const [isConnectedMock, setIsConnectedMock] = useState(false);

  // Wagmi hooks for real Web3 interaction
  const { address: walletAddress, isConnected: isWalletConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();

  const isConnected = isWalletConnected || isConnectedMock;
  
  const currentUser: User = isWalletConnected
    ? { name: "Web3 User", address: walletAddress || "0x0000000000000000000000000000000000000000", role: "Active Operator" }
    : currentUserMock;

  const [assets, setAssets] = useState<Array<Asset>>([
    {
      id: "1",
      title: "Alice Original Asset",
      description: "An abstract mathematical fractal design visualizing chaos theory.",
      aiModel: "Stable Diffusion 3",
      contentHash: "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab1234",
      royaltySplit: 10,
      creatorAddress: "0x1111111111111111111111111111111111111111",
      phash: "0f0f0f0f0f0f0f0f",
      timestamp: "22 Aug 2026 18:12",
      transactionHash: "0x892a3bc90de12c43abef9023ab90d34e902bc345d90e20c90f23a91bc90d1f43",
    },
    {
      id: "2",
      title: "Bob Remix Asset",
      description: "A fluid remix of mathematical fractals combining animation frames.",
      aiModel: "Midjourney v6",
      contentHash: "0xcd34e567f01234567890abcdef1234567890abcdef1234567890abcdef1234cd",
      royaltySplit: 10,
      creatorAddress: "0x2222222222222222222222222222222222222222",
      parentId: "1",
      phash: "0f0f0f0f0f0f0f00",
      timestamp: "23 Aug 2026 09:30",
      transactionHash: "0x91bc83af10df20c908f23a91bc90d1f43a91bc90de12c43abef9023ab90d34e90",
    },
  ]);

  const [agreements, setAgreements] = useState<Array<LicensingAgreement>>([]);

  // Database synchronization: load initial records on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const assetsRes = await fetch("/api/assets");
        let loadedAssets: Array<Asset> = [];
        if (assetsRes.ok) {
          loadedAssets = await assetsRes.json();
          setAssets(loadedAssets);
        }

        const agreementsRes = await fetch("/api/agreements");
        if (agreementsRes.ok) {
          const agreementsData = await agreementsRes.json();
          // Map asset contentHash back to asset.id for UI elements
          const mappedAgreements = agreementsData.map((agreement: any) => {
            const matchedAsset = loadedAssets.find((a) => a.contentHash === agreement.assetId);
            return {
              ...agreement,
              assetId: matchedAsset ? matchedAsset.id : agreement.assetId,
            };
          });
          setAgreements(mappedAgreements);
        }
      } catch (err) {
        console.error("Failed to load initial database records:", err);
      }
    }
    loadInitialData();
  }, []);

  // Database synchronization: register connected wallet profile
  useEffect(() => {
    async function registerOrCheckUser() {
      if (!currentUser || !currentUser.address) return;
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: currentUser.address,
            name: currentUser.name,
            role: currentUser.role,
          }),
        });
      } catch (err) {
        console.error("User registration check failed:", err);
      }
    }
    registerOrCheckUser();
  }, [currentUser]);

  const connectWallet = (walletName: string) => {
    // If client has an injected provider, connect it, else run fallback mock
    const targetConnector = connectors.find(
      (c) => c.name.toLowerCase() === walletName.toLowerCase() || c.id === "injected"
    );

    if (targetConnector && typeof window !== "undefined" && (window as any).ethereum) {
      connect({ connector: targetConnector });
    } else {
      setIsConnectedMock(true);
      if (walletName === "MetaMask") {
        setCurrentUserMock(users[0]); // Alice
      } else if (walletName === "Coinbase Wallet") {
        setCurrentUserMock(users[1]); // Bob
      } else if (walletName === "WalletConnect") {
        setCurrentUserMock(users[2]); // Charlie
      }
    }
  };

  const disconnectWallet = () => {
    if (isWalletConnected) {
      disconnect();
    }
    setIsConnectedMock(false);
  };

  const registerAsset = async (newAsset: {
    title: string;
    description: string;
    aiModel: string;
    contentHash: string;
    royaltySplit: number;
    creatorAddress: string;
    parentId?: string;
    phash?: string;
  }) => {
    let txHash = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (isWalletConnected) {
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractAbi,
          functionName: "registerAsset",
          args: [
            newAsset.contentHash,
            newAsset.title,
            BigInt(newAsset.royaltySplit),
            newAsset.parentId || "",
            "0xlicensetermshashplaceholder"
          ],
        });
        if (hash) txHash = hash;
      } catch (err) {
        console.error("Contract transaction failed, using mock transaction hash", err);
      }
    }

    // Save registration details to persistent database
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAsset.title,
          description: newAsset.description,
          aiModel: newAsset.aiModel,
          contentHash: newAsset.contentHash,
          royaltySplit: newAsset.royaltySplit,
          creatorAddress: newAsset.creatorAddress,
          parentId: newAsset.parentId,
          phash: newAsset.phash || "0000000000000000",
        }),
      });

      if (response.ok) {
        const savedAsset = await response.json();
        setAssets((prev) => [...prev, savedAsset]);
        return savedAsset.id;
      }
    } catch (err) {
      console.error("Failed to persist asset in database:", err);
    }

    // Fallback: local memory insert
    const nextId = String(assets.length + 1);
    const formattedAsset: Asset = {
      ...newAsset,
      id: nextId,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      transactionHash: txHash,
    };

    setAssets((prev) => [...prev, formattedAsset]);
    return nextId;
  };

  const buyLicense = async (agreement: {
    assetId: string;
    licenseeAddress: string;
    price: number;
    royaltySplit: number;
  }) => {
    let txHash = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const asset = assets.find((a) => a.id === agreement.assetId);

    if (isWalletConnected && asset) {
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractAbi,
          functionName: "purchaseLicense",
          args: [asset.contentHash],
          value: parseEther("0.001"),
        });
        if (hash) txHash = hash;
      } catch (err) {
        console.error("Contract transaction failed, using mock transaction hash", err);
      }
    }

    // Save licensing transaction to database
    try {
      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: asset ? asset.contentHash : agreement.assetId,
          licenseeAddress: agreement.licenseeAddress,
          transactionHash: txHash,
          price: agreement.price,
          royaltySplit: agreement.royaltySplit,
        }),
      });

      if (response.ok) {
        const savedAgreement = await response.json();
        if (asset) {
          savedAgreement.assetId = asset.id;
        }
        setAgreements((prev) => [...prev, savedAgreement]);
        return;
      }
    } catch (err) {
      console.error("Failed to persist agreement in database:", err);
    }

    // Fallback: local memory insert
    const newAgreement: LicensingAgreement = {
      ...agreement,
      id: String(agreements.length + 1),
      transactionHash: txHash,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setAgreements((prev) => [...prev, newAgreement]);
  };

  return (
    <StateContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser: setCurrentUserMock,
        assets,
        agreements,
        isConnected,
        connectWallet,
        disconnectWallet,
        registerAsset,
        buyLicense,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function StateProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StateProviderContent>{children}</StateProviderContent>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
