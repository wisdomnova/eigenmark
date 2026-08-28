"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface DropdownProps {
  options: Array<DropdownOption>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {label && (
        <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 bg-surface-active text-text-primary text-sm font-light px-4 rounded-xl flex items-center justify-between cursor-pointer outline-none transition-colors duration-150 hover:bg-surface-active/85"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IconChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-250 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-surface-active rounded-xl py-2 z-50 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-xs font-light tracking-wide transition-colors duration-150 cursor-pointer flex flex-col gap-0.5 ${
                opt.value === value
                  ? "bg-brand text-background"
                  : "text-text-primary hover:bg-surface-active/70"
              }`}
            >
              <span>{opt.label}</span>
              {opt.sublabel && (
                <span
                  className={`text-[9px] font-mono ${
                    opt.value === value ? "text-background/80" : "text-text-muted"
                  }`}
                >
                  {opt.sublabel}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
