"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Instruction } from "@/lib/types"
import { useIDLStore } from "@/store/idl-store"

interface InstructionsViewProps {
  instructions: Instruction[]
}

const InstructionsViewTab = () => {
  const instructions = useIDLStore((state) => state.idlData.instructions)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Instructions ({instructions.length})</CardTitle>
        <CardDescription>All instructions defined in the IDL with their accounts and arguments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={instructions[0]?.name} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full  h-full">
            {instructions.map((instruction:Instruction, index: number) => (
              <TabsTrigger key={index} value={instruction.name} className="px-4 py-2 rounded-md">
                {instruction.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {instructions.map((instruction, index) => (
            <TabsContent key={index} value={instruction.name} className="p-4 border rounded-md mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Discriminator</h4>
                  <div className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                    [{instruction.discriminator.join(", ")}]
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Accounts</h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Properties</th>
                          <th className="text-left p-2">PDA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instruction.accounts.map((account, accountIndex) => (
                          <tr key={accountIndex} className="border-t">
                            <td className="p-2 font-mono">{account.name}</td>
                            <td className="p-2">
                              {account.writable && (
                                <Badge variant="outline" className="mr-1">writable</Badge>
                              )}
                              {account.signer && <Badge variant="outline">signer</Badge>}
                              {account.address && (
                                <div className="mt-1 text-xs font-mono break-all">{account.address}</div>
                              )}
                            </td>
                            <td className="p-2">
                              {account.pda ? (
                                <Badge variant="secondary">PDA</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Arguments</h4>
                  {instruction.args.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {instruction.args.map((arg, argIndex) => (
                            <tr key={argIndex} className="border-t">
                              <td className="p-2 font-mono">{arg.name}</td>
                              <td className="p-2 font-mono">{arg.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No arguments</div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default InstructionsViewTab
