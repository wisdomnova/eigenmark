"use client";

import { useAppState } from "@/context/StateContext";
import RegisterForm from "@/components/dashboard/RegisterForm";
import { useRouter } from "next/navigation";

export default function DerivePage() {
  const { currentUser, registerAsset, assets } = useAppState();
  const router = useRouter();

  const handleRegister = (newAsset: {
    title: string;
    description: string;
    aiModel: string;
    contentHash: string;
    royaltySplit: number;
    creatorAddress: string;
    parentId?: string;
  }) => {
    registerAsset(newAsset);
    router.push("/portal/graph");
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <RegisterForm
        currentUser={currentUser}
        onRegister={handleRegister}
        assets={assets}
        isDeriving={true}
      />
    </div>
  );
}
