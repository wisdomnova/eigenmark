"use client";

import { useRouter } from "next/navigation";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import PartnerList from "@/components/landing/PartnerList";

export default function Home() {
  const router = useRouter();

  const handleEnterPortal = () => {
    router.push("/portal/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-text-primary antialiased">
      <LandingHero onEnterPortal={handleEnterPortal} />
      <LandingFeatures />
      <PartnerList />
    </div>
  );
}

