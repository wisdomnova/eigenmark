"use client";

import { useAppState } from "@/context/StateContext";
import VerifyPanel from "@/components/dashboard/VerifyPanel";

export default function VerifyPage() {
  const { assets } = useAppState();

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <VerifyPanel assets={assets} />
    </div>
  );
}
