"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { UploadCloud, Moon, Sun } from "lucide-react";

import {parseIDL} from "@/lib/parse-idl"
import { useIDLStore } from "@/store/idl-store";
import { useRouter } from "next/navigation";

type ConnectionType = 'Devnet' | 'Mainnet' | 'Localnet';

export default function EnterOrUploadIDL() {
  const [programId, setProgramId] = useState("");
  const [connection, setConnection] = useState<ConnectionType>("Devnet");
  const [darkMode, setDarkMode] = useState(false);

  const setIdlData = useIDLStore((state) => state.setIdlData);
  const router = useRouter();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) return; 
      try {
        const idl = JSON.parse(e.target.result as string);
        setIdlData(parseIDL(idl));
        router.push("/visualize");
      } catch (err) {
        console.error("Invalid IDL file", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-10 transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-indigo-100 via-pink-200 to-purple-300 text-gray-900"
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-300 dark:bg-gray-700 shadow-md hover:scale-105 transition"
      >
        {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-900" />}
      </button>

      <Card
        className={`w-full max-w-2xl p-8 shadow-2xl rounded-2xl border transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-400"
        }`}
      >
        <CardContent className="flex flex-col gap-6">
          <h1
            className={`text-5xl font-extrabold text-center drop-shadow-lg transition-all duration-300 ${
              darkMode ? "text-purple-300" : "text-purple-700"
            }`}
          >
            ✨ Solana Grimoire 🌸
          </h1>
          {/* <Input
            type="text"
            placeholder="Enter Program ID"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className={`rounded-lg p-3 border shadow-md focus:ring-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-400"
                : "bg-purple-100 text-gray-900 border-purple-400 focus:ring-purple-500"
            }`}
          />
          
          <Select value={connection} onValueChange={(value) => setConnection(value as ConnectionType)}>
            <SelectTrigger
              className={`p-3 rounded-lg border shadow-md focus:ring-2 transition-all duration-300 w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-400"
                  : "bg-purple-100 text-gray-900 border-purple-400 focus:ring-purple-500"
              }`}
            >
              {connection}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Devnet">Devnet</SelectItem>
              <SelectItem value="Mainnet">Mainnet</SelectItem>
              <SelectItem value="Localnet">Localnet</SelectItem>

            </SelectContent>
          </Select> */}
          <p className="text-center text-purple-600">Or</p>
          <label
            className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:scale-105 transition-all shadow-lg ${
              darkMode
                ? "border-gray-500 hover:bg-gray-700"
                : "border-purple-500 hover:bg-purple-200"
            }`}
          >
            <UploadCloud size={28} className={darkMode ? "text-gray-300" : "text-purple-600"} />
            <span className={darkMode ? "text-gray-300 font-semibold" : "text-purple-700 font-semibold"}>
              Upload IDL
            </span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
          {/* <Button
            className={`text-lg font-semibold rounded-lg p-3 shadow-lg transition-all duration-300 ${
              darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            Submit
          </Button> */}
        </CardContent>
      </Card>

      {/* {idlData && (
        <Card
          className={`w-full max-w-2xl p-8 mt-8 shadow-2xl rounded-2xl border transition-all duration-300 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-400"
          }`}
        >
          <CardContent>
            <h2
              className={`text-3xl font-semibold drop-shadow-md transition-all duration-300 ${
                darkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              📜 Program Overview
            </h2>
            <p className={`mt-2 transition-all duration-300 ${darkMode ? "text-gray-300" : "text-purple-600"}`}>
              Name: <span className={darkMode ? "text-white font-medium" : "text-gray-900 font-medium"}>{idlData.name}</span>
            </p>
            <p className={darkMode ? "text-gray-300" : "text-purple-600"}>
              Version: <span className={darkMode ? "text-white font-medium" : "text-gray-900 font-medium"}>{idlData.version}</span>
            </p>
            <p className={darkMode ? "text-gray-300" : "text-purple-600"}>
              Description: <span className={darkMode ? "text-white font-medium" : "text-gray-900 font-medium"}>{idlData.description}</span>
            </p>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
