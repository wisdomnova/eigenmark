"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0B0D] text-[#F9FAFB] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#14161A] p-8 rounded-3xl text-center flex flex-col items-center">
          <h2 className="text-xl font-light mb-2">Critical System Error</h2>
          <p className="text-xs text-[#9CA3AF] mb-6">
            A critical layout error occurred. Please reload the application.
          </p>
          <button
            onClick={() => reset()}
            className="py-2.5 px-6 bg-[#60A5FA] text-[#0A0B0D] rounded-full text-xs cursor-pointer hover:bg-white transition-colors"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
