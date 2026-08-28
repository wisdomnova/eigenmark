"use client";

import { useState } from "react";
import { useAppState } from "@/context/StateContext";
import RegisterForm from "@/components/dashboard/RegisterForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { currentUser, registerAsset, assets } = useAppState();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (newAsset: {
    title: string;
    description: string;
    aiModel: string;
    contentHash: string;
    royaltySplit: number;
    creatorAddress: string;
  }) => {
    try {
      setIsSubmitting(true);
      await registerAsset(newAsset);
      router.push("/portal/graph");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <RegisterForm
        currentUser={currentUser}
        onRegister={handleRegister}
        assets={assets}
        isDeriving={false}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
