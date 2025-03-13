"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIDLStore } from "@/store/idl-store"
import InstructionsViewTab from "@/components/instruction-view-tab"
import OverviewDiagram from "@/components/overview-diagram"
import StateView from "@/components/state-view"
import ProgramsView from "@/components/programs"
import { useRouter } from "next/navigation"


export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")
  const idlData= useIDLStore((state) => state.idlData); 
  const router = useRouter();

  if (!idlData) {
    router.push("/");
  }

  return (
      <main className="min-h-screen transition-all duration-300 bg-gradient-to-br from-indigo-100 via-pink-200 to-purple-300 text-gray-900">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl text-purple-600 font-bold tracking-tight">✨ Solana Grimoire 🌸</h1>
              <p className="text-black mt-1 ml-12">
                {idlData.name} - {idlData.version}
              </p>
            </div>
          </header>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 text-black  opacity-90">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="pdas">PDAs</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="token-accounts">Token Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <OverviewDiagram />
            </TabsContent>

            <TabsContent value="states" className="space-y-4">
                <StateView />
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <InstructionsViewTab  />
            </TabsContent>

            <TabsContent value="pdas" className="space-y-4">
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
                <ProgramsView />
            </TabsContent>

            <TabsContent value="token-accounts" className="space-y-4">
              
            </TabsContent>
          </Tabs>
        </div>
      </main>
  )
}

