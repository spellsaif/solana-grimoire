"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIDLStore } from "@/store/idl-store"
import InstructionsViewTab from "@/components/instruction-view-tab"
import StateView from "@/components/state-view"
import ProgramsView from "@/components/programs"
import { useRouter } from "next/navigation"
import ERDiagram from "@/components/er-diagram"
import Link from "next/link"


export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")
  const idlData= useIDLStore((state) => state.idlData); 
  const router = useRouter();

  useEffect(() => {
    if (!idlData) {
      router.push("/");
    }
  }, [idlData, router]); // Runs when idlData changes

  if (!idlData) {
    return null; // Avoid rendering UI while redirecting
  }

  return (
      <main className="min-h-screen transition-all duration-300 bg-gradient-to-br from-indigo-100 via-pink-200 to-purple-300 text-gray-900">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl text-purple-600 font-bold tracking-tight"><Link href="/">✨ Solana Grimoire 🌸</Link></h1>
              <p className="text-black mt-1 ml-12">
                {idlData.name}
              </p>
            </div>
          </header>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 md:grid-cols-4 gap-2 text-black  opacity-90">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              {/* <TabsTrigger value="pdas">PDAs</TabsTrigger> */}
              <TabsTrigger value="programs">Programs</TabsTrigger>
              {/* <TabsTrigger value="token-accounts">Token Accounts</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                {/* <OverviewDiagram /> */}
                <ERDiagram/>
            </TabsContent>

            <TabsContent value="states" className="space-y-4">
                <StateView />
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <InstructionsViewTab  />
            </TabsContent>

            {/* <TabsContent value="pdas" className="space-y-4">
            </TabsContent> */}

            <TabsContent value="programs" className="space-y-4">
                <ProgramsView />
            </TabsContent>

            {/* <TabsContent value="token-accounts" className="space-y-4">
              
            </TabsContent> */}
          </Tabs>
        </div>
      </main>
  )
}

