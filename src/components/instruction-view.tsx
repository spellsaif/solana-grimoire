"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { Instruction } from "@/lib/types"

interface InstructionsViewProps {
  instructions: Instruction[]
}

const InstructionsView = ({ instructions }: InstructionsViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions ({instructions.length})</CardTitle>
        <CardDescription>All instructions defined in the IDL with their accounts and arguments</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {instructions.map((instruction, index) => (
            <AccordionItem key={index} value={instruction.name}>
              <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                <div className="flex items-center">
                  <span className="font-medium">{instruction.name}</span>
                  <Badge variant="outline" className="ml-2">
                    Instruction
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Discriminator</h4>
                    <div className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
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
                                  <Badge variant="outline" className="mr-1">
                                    writable
                                  </Badge>
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default InstructionsView
