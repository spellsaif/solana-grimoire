"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const IDLDownloader = () => {
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchIDL = async () => {
    if (!programId) {
      setError("Please enter a Solana Program ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/fetch-idl?programId=${programId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch IDL.");
      }

      // Automatically trigger download
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = `${programId}-idl.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Solana IDL Downloader</h2>
      <Input
        type="text"
        placeholder="Enter Solana Program ID"
        value={programId}
        onChange={(e) => setProgramId(e.target.value)}
        className="mb-2"
      />
      <Button onClick={fetchIDL} disabled={loading}>
        {loading ? "Fetching..." : "Download IDL"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default IDLDownloader;
