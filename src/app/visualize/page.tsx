"use client"

import { useState } from "react"
// import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIDLStore } from "@/store/idl-store"
import InstructionsViewTab from "@/components/instruction-view-tab"
import OverviewDiagram from "@/components/overview-diagram"

export default function Home() {
  const [activeTab, setActiveTab] = useState("visualizer")
  const idlData= useIDLStore((state) => state.idlData); 

  return (
    // <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background bg-gradient-to-br from-indigo-100 via-pink-200 to-purple-300 text-gray-900">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl text-purple-600 font-bold tracking-tight text-foreground">Solana Grimoire</h1>
              <p className="text-muted-foreground mt-1">
                {idlData.name} - {idlData.version}
              </p>
            </div>
          </header>

          <Tabs defaultValue="visualizer" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 text-purple-600  opacity-90 border-purple-600">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="pdas">PDAs</TabsTrigger>
              <TabsTrigger value="system-programs">System Programs</TabsTrigger>
              <TabsTrigger value="token-accounts">Token Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <OverviewDiagram />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <InstructionsViewTab  />
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4">
            </TabsContent>

            <TabsContent value="pdas" className="space-y-4">
            </TabsContent>

            <TabsContent value="system-programs" className="space-y-4">
            </TabsContent>

            <TabsContent value="token-accounts" className="space-y-4">
              
            </TabsContent>
          </Tabs>
        </div>
      </main>
    // </ThemeProvider>
  )
}

