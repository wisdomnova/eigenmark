"use client";

import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

interface RegisterFormProps {
  currentUser: { name: string; address: string; role: string };
  onRegister: (asset: {
    title: string;
    description: string;
    aiModel: string;
    contentHash: string;
    royaltySplit: number;
    creatorAddress: string;
    parentId?: string;
  }) => void;
  assets: Array<{ id: string; title: string; contentHash: string }>;
  isDeriving?: boolean;
}

export default function RegisterForm({
  currentUser,
  onRegister,
  assets,
  isDeriving = false,
}: RegisterFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiModel, setAiModel] = useState("Stable Diffusion 3");
  const [royaltySplit, setRoyaltySplit] = useState(10);
  const [parentId, setParentId] = useState("");
  
  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [isHashing, setIsHashing] = useState(false);

  // Generate a mock SHA256 content hash
  const generateMockHash = (name: string) => {
    setIsHashing(true);
    setTimeout(() => {
      let hash = "0x";
      const alphabet = "0123456789abcdef";
      for (let i = 0; i < 64; i++) {
        hash += alphabet[Math.floor(Math.random() * 16)];
      }
      setFileHash(hash);
      setIsHashing(false);
    }, 800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      generateMockHash(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      generateMockHash(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileHash || !title) return;

    onRegister({
      title,
      description,
      aiModel,
      contentHash: fileHash,
      royaltySplit,
      creatorAddress: currentUser.address,
      parentId: isDeriving && parentId ? parentId : undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setFileHash("");
    setFileName("");
    setParentId("");
  };

  const aiOptions = [
    { value: "Stable Diffusion 3", label: "Stable Diffusion 3" },
    { value: "Midjourney v6", label: "Midjourney v6" },
    { value: "Runway Gen 3", label: "Runway Gen 3" },
    { value: "Sora Video Model", label: "Sora Video Model" },
    { value: "Human Created", label: "Human Created (No AI)" },
  ];

  const parentOptions = assets.map((asset) => ({
    value: asset.id,
    label: asset.title,
    sublabel: `${asset.contentHash.substring(0, 16)}...`,
  }));

  return (
    <div className="w-full max-w-2xl bg-surface p-8 rounded-3xl mx-auto my-12">
      <div className="mb-8 text-left">
        <span className="text-xs uppercase tracking-widest text-brand font-normal block mb-2">
          {isDeriving ? "Attribution registry" : "Provenance registration"}
        </span>
        <h2 className="text-2xl font-light text-text-primary tracking-tight">
          {isDeriving ? "Register derivative work" : "Anchor original work"}
        </h2>
        <p className="text-xs font-light text-text-muted mt-1 leading-relaxed">
          Upload your creative file to compute its fingerprint and write the license to the ledger.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* File Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`h-40 rounded-2xl flex flex-col items-center justify-center border-none transition-colors duration-200 text-center p-4 relative ${
            dragActive
              ? "bg-surface-active"
              : fileHash
              ? "bg-surface-active/60"
              : "bg-surface-active/30"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {isHashing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent animate-spin rounded-full"></div>
              <span className="text-xs font-light text-text-muted">Computing hash</span>
            </div>
          ) : fileHash ? (
            <div className="flex flex-col items-center gap-1 max-w-full">
              <span className="text-xs font-normal text-success">Fingerprint computed</span>
              <span className="text-sm font-light text-text-primary truncate max-w-xs">
                {fileName}
              </span>
              <span className="text-[10px] font-mono text-text-muted truncate max-w-md mt-1">
                {fileHash}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-text-muted"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-sm font-light text-text-primary">
                Drag creative file here or click to browse
              </span>
              <span className="text-[10px] text-text-muted">
                Images, video, or audio files are accepted
              </span>
            </div>
          )}
        </div>

        {/* Text Fields */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs uppercase tracking-wider text-text-muted">
            Asset Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title of your work"
            className="w-full bg-surface-active text-text-primary text-sm font-light h-12 px-4 rounded-xl outline-none border-none placeholder-text-muted/50 mt-1"
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs uppercase tracking-wider text-text-muted">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the creative work and attributes"
            rows={3}
            className="w-full bg-surface-active text-text-primary text-sm font-light p-4 rounded-xl outline-none border-none resize-none placeholder-text-muted/50 mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1 text-left">
            <Dropdown
              options={aiOptions}
              value={aiModel}
              onChange={setAiModel}
              label="AI Generation Engine"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs uppercase tracking-wider text-text-muted">
              Royalty Split Percentage
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                max="100"
                value={royaltySplit}
                onChange={(e) => setRoyaltySplit(Number(e.target.value))}
                className="w-full bg-surface-active text-text-primary text-sm font-light h-12 px-4 rounded-xl outline-none border-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-mono pointer-events-none">
                % to original
              </span>
            </div>
          </div>
        </div>

        {/* Parent Selector if Deriving */}
        {isDeriving && (
          <div className="flex flex-col gap-1 text-left">
            <Dropdown
              options={parentOptions}
              value={parentId}
              onChange={setParentId}
              label="Link to Original Parent Asset"
              placeholder="Select the original creative work you remixed"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!fileHash || !title}
          className={`w-full py-4 text-sm font-normal text-background rounded-full transition-colors duration-200 cursor-pointer mt-4 ${
            fileHash && title
              ? "bg-brand hover:bg-text-primary"
              : "bg-surface-active/50 text-text-muted cursor-not-allowed"
          }`}
        >
          Anchor Record on Chain
        </button>
      </form>
    </div>
  );
}
