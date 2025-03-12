"use client"

import { useState } from "react"
// import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InstructionsView from "@/components/instruction-view"
import { useIDLStore } from "@/store/idl-store"

export default function Home() {
  const [activeTab, setActiveTab] = useState("visualizer")
  const idlData= useIDLStore((state) => state.idlData); 

  return (
    // <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Solana Grimoire</h1>
              <p className="text-muted-foreground mt-1">
                {idlData.name} - {idlData.version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* <ModeToggle /> */}
              <Button
                variant="outline"
                onClick={() => {
                  const visualizerElement = document.getElementById("idl-visualizer")
                  if (visualizerElement) {
                    // Use html2canvas and jsPDF in a real implementation
                    alert("Export functionality would be implemented with html2canvas and jsPDF")
                  }
                }}
              >
                Export as PNG
              </Button>
            </div>
          </header>

          <Tabs defaultValue="visualizer" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
              <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="pdas">PDAs</TabsTrigger>
              <TabsTrigger value="system-programs">System Programs</TabsTrigger>
              <TabsTrigger value="token-accounts">Token Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="visualizer" className="space-y-4">
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <InstructionsView  />
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

