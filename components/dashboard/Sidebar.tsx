"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import { useState, useRef, useEffect } from "react";
import {
  IconPlus,
  IconGitFork,
  IconSearch,
  IconNetwork,
  IconReceipt,
  IconArrowLeft,
} from "@tabler/icons-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { users, currentUser, setCurrentUser } = useAppState();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { href: "/portal/register", label: "Register Work", icon: IconPlus },
    { href: "/portal/derive", label: "Derive Work", icon: IconGitFork },
    { href: "/portal/verify", label: "Verify Provenance", icon: IconSearch },
    { href: "/portal/graph", label: "Lineage Graph", icon: IconNetwork },
    { href: "/portal/licensing", label: "Settlement Console", icon: IconReceipt },
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-surface flex flex-col justify-between py-6 px-4 z-40 select-none">
      {/* Top Section */}
      <div>
        {/* Brand Link */}
        <div className="px-3 mb-6">
          <Link
            href="/"
            className="text-lg font-light tracking-tight text-text-primary hover:text-brand transition-colors duration-200 cursor-pointer block"
          >
            ProofChain
          </Link>
          <div className="w-full bg-surface-active/30 rounded-xl px-3 py-2 text-[10px] font-light text-text-muted mt-3 cursor-pointer">
            Arbitrum Sepolia Testnet
          </div>
        </div>

        {/* Menu Section */}
        <div className="mt-8">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-normal block px-3 mb-3">
            Services
          </span>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-light tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-brand text-background"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-active"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        {/* Return to Landing Page Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full py-2 bg-surface-active hover:bg-surface-active/80 text-[10px] font-light text-text-primary rounded-xl cursor-pointer transition-colors duration-200"
        >
          <IconArrowLeft size={12} strokeWidth={1.5} />
          <span>Exit Portal</span>
        </button>

        {/* Brooklyn-style Profile Card */}
        <div className="bg-surface-active/30 p-3 rounded-2xl flex flex-col gap-3 relative" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-surface-active/40 p-1.5 rounded-xl transition-colors duration-150"
          >
            {/* Avatar placeholder circle */}
            <div className="w-8 h-8 rounded-full bg-brand text-background flex items-center justify-center font-normal text-sm uppercase">
              {currentUser.name.substring(0, 1)}
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-xs font-normal text-text-primary block leading-none truncate">
                {currentUser.name}
              </span>
              <span className="text-[9px] font-mono text-text-muted block mt-0.5 truncate">
                {currentUser.address.substring(0, 6)}...{currentUser.address.slice(-4)}
              </span>
            </div>
          </div>

          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-active rounded-xl py-2 z-50">
              {users.map((user) => (
                <button
                  key={user.name}
                  type="button"
                  onClick={() => {
                    setCurrentUser(user);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-[10px] font-light tracking-wide transition-colors duration-150 cursor-pointer flex flex-col gap-0.5 ${
                    user.name === currentUser.name
                      ? "bg-brand text-background"
                      : "text-text-primary hover:bg-surface/70"
                  }`}
                >
                  <span>{user.name}</span>
                  <span className={`text-[8px] font-mono ${user.name === currentUser.name ? "text-background/80" : "text-text-muted"}`}>
                    {user.role} ({user.address.substring(0, 6)}...)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
