"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IDLData } from "@/lib/types"
import { useIDLStore } from "@/store/idl-store"

interface SystemProgramsViewProps {
  idlData: IDLData
}

const SystemProgramsView = () => {
  // Extract all system programs from instructions
  const systemPrograms = new Map<string, Set<string>>()
  const idlData = useIDLStore((state) => state.idlData);

  idlData.instructions.forEach((instruction) => {
    instruction.accounts.forEach((account) => {
      if (account.address) {
        // Add program to map if it doesn't exist
        if (!systemPrograms.has(account.address)) {
          systemPrograms.set(account.address, new Set())
        }

        // Add instruction to program's set
        systemPrograms.get(account.address)?.add(instruction.name)
      }
    })
  })

  // Convert to array for rendering
  const programsArray = Array.from(systemPrograms.entries()).map(([address, instructions]) => ({
    address,
    name: getProgramName(address),
    instructions: Array.from(instructions),
  }))

  function getProgramName(address: string): string {
    switch (address) {
      case "11111111111111111111111111111111":
        return "System Program"
      case "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA":
        return "Token Program"
      case "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL":
        return "Associated Token Program"
      case "SysvarRent111111111111111111111111111111111":
        return "Rent Sysvar"
      default:
        return "Unknown Program"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Programs ({programsArray.length})</CardTitle>
        <CardDescription>All system programs used by the protocol</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {programsArray.map((program, index) => (
            <div key={index} className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">{program.name}</h3>
              <div className="text-sm font-mono mb-4 break-all text-muted-foreground">{program.address}</div>

              <h4 className="text-sm font-medium mb-2">Used in Instructions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {program.instructions.map((instruction, i) => (
                  <div key={i} className="bg-muted px-3 py-2 rounded-md text-sm">
                    {instruction}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemProgramsView

