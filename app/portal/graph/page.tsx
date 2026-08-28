"use client";

import { useAppState } from "@/context/StateContext";
import ProvenanceGraph from "@/components/dashboard/ProvenanceGraph";

export default function GraphPage() {
  const { assets } = useAppState();

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <ProvenanceGraph assets={assets} />
    </div>
  );
}
