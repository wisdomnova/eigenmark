"use client";

import { useAppState } from "@/context/StateContext";
import LicensingConsole from "@/components/dashboard/LicensingConsole";

export default function LicensingPage() {
  const { currentUser, assets, agreements, buyLicense } = useAppState();

  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <LicensingConsole
        currentUser={currentUser}
        assets={assets}
        agreements={agreements}
        onBuyLicense={buyLicense}
      />
    </div>
  );
}
