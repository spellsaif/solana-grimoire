"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import type { IDLData } from "@/lib/types"
import mermaid from "mermaid"
import { useIDLStore } from "@/store/idl-store"

interface MermaidDiagramViewProps {
  idlData: IDLData 
}

const MermaidDiagramView = () => {
  
  const idlData = useIDLStore((state) => state.idlData);
  const containerRef = useRef<HTMLDivElement>(null)
  const [diagramType, setDiagramType] = useState<"accounts" | "instructions" | "flow">("flow")
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: "basis",
      },
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const generateDiagram = async () => {
      let diagram = ""

      if (diagramType === "accounts") {
        diagram = generateAccountsDiagram()
      } else if (diagramType === "instructions") {
        diagram = generateInstructionsDiagram()
      } else {
        diagram = generateFlowDiagram()
      }

      try {
        const { svg } = await mermaid.render("mermaid-diagram", diagram)
        containerRef.current!.innerHTML = svg

        // Add event listeners for dragging
        const svgElement = containerRef.current!.querySelector("svg")
        if (svgElement) {
          svgElement.style.transformOrigin = "0 0"
          svgElement.style.transform = `scale(${scale}) translate(${position.x}px, ${position.y}px)`

          // Add tooltips to nodes
          const nodes = svgElement.querySelectorAll(".node")
          nodes.forEach((node) => {
            const titleElement = node.querySelector("title")
            if (titleElement) {
              const nodeId = titleElement.textContent
              const nodeData = getNodeData(nodeId)

              if (nodeData) {
                // Create tooltip
                const tooltip = document.createElement("div")
                tooltip.className =
                  "absolute hidden z-50 p-2 bg-popover text-popover-foreground rounded shadow-lg max-w-xs"
                tooltip.innerHTML = nodeData.tooltip
                document.body.appendChild(tooltip)

                // Show tooltip on hover
                node.addEventListener("mouseenter", (e) => {
                  const rect = node.getBoundingClientRect()
                  tooltip.style.left = `${rect.right + 10}px`
                  tooltip.style.top = `${rect.top}px`
                  tooltip.classList.remove("hidden")
                })

                node.addEventListener("mouseleave", () => {
                  tooltip.classList.add("hidden")
                })
              }
            }
          })

          // Add mouse events for dragging
          svgElement.addEventListener("mousedown", handleMouseDown)
          window.addEventListener("mousemove", handleMouseMove)
          window.addEventListener("mouseup", handleMouseUp)

          // Add wheel event for zooming
          svgElement.addEventListener("wheel", handleWheel)
        }
      } catch (error) {
        console.error("Error rendering diagram:", error)
      }
    }

    generateDiagram()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [diagramType, scale, position, idlData])

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const dx = (e.clientX - dragStart.x) / scale
    const dy = (e.clientY - dragStart.y) / scale

    setPosition({
      x: position.x + dx,
      y: position.y + dy,
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()

    // Calculate new scale
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(3, scale + delta))

    // Calculate mouse position relative to the container
    const rect = containerRef.current!.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate new position to zoom toward mouse cursor
    const newPosition = {
      x: position.x - (mouseX / scale - mouseX / newScale),
      y: position.y - (mouseY / scale - mouseY / newScale),
    }

    setScale(newScale)
    setPosition(newPosition)
  }

  const handleZoomIn = () => {
    const newScale = Math.min(3, scale + 0.2)
    setScale(newScale)
  }

  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scale - 0.2)
    setScale(newScale)
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const getNodeData = (nodeId: string | null) => {
    if (!nodeId) return null

    // Remove quotes from nodeId if present
    const cleanNodeId = nodeId.replace(/"/g, "")

    // Check if it's an account
    const account = idlData.accounts.find((a) => a.name === cleanNodeId)
    if (account) {
      const accountType = idlData.types.find((t) => t.name === account.name)
      let fieldsHtml = "<p>No fields found</p>"

      if (accountType && accountType.type.fields.length > 0) {
        fieldsHtml =
          '<ul class="list-disc pl-4">' +
          accountType.type.fields
            .map((field) => {
              const fieldType = typeof field.type === "string" ? field.type : JSON.stringify(field.type)
              return `<li><span class="font-semibold">${field.name}</span>: ${fieldType}</li>`
            })
            .join("") +
          "</ul>"
      }

      return {
        type: "account",
        tooltip: `
          <div class="space-y-2">
            <h3 class="font-bold text-sm">${account.name}</h3>
            <p class="text-xs">Account Type</p>
            <div class="text-xs">
              <p class="font-semibold">Discriminator:</p>
              <p class="font-mono text-xs">[${account.discriminator.join(", ")}]</p>
            </div>
            <div class="text-xs">
              <p class="font-semibold">Fields:</p>
              ${fieldsHtml}
            </div>
          </div>
        `,
      }
    }

    // Check if it's an instruction
    const instruction = idlData.instructions.find((i) => i.name === cleanNodeId)
    if (instruction) {
      const accountsHtml =
        instruction.accounts.length > 0
          ? '<ul class="list-disc pl-4">' +
            instruction.accounts
              .map((acc) => {
                const props = []
                if (acc.writable) props.push("writable")
                if (acc.signer) props.push("signer")
                if (acc.pda) props.push("pda")

                const propsStr = props.length > 0 ? ` (${props.join(", ")})` : ""
                return `<li><span class="font-semibold">${acc.name}</span>${propsStr}</li>`
              })
              .join("") +
            "</ul>"
          : "<p>No accounts</p>"

      const argsHtml =
        instruction.args.length > 0
          ? '<ul class="list-disc pl-4">' +
            instruction.args
              .map((arg) => {
                return `<li><span class="font-semibold">${arg.name}</span>: ${arg.type}</li>`
              })
              .join("") +
            "</ul>"
          : "<p>No arguments</p>"

      return {
        type: "instruction",
        tooltip: `
          <div class="space-y-2">
            <h3 class="font-bold text-sm">${instruction.name}</h3>
            <p class="text-xs">Instruction</p>
            <div class="text-xs">
              <p class="font-semibold">Accounts:</p>
              ${accountsHtml}
            </div>
            <div class="text-xs">
              <p class="font-semibold">Arguments:</p>
              ${argsHtml}
            </div>
          </div>
        `,
      }
    }

    // Check if it's a program
    if (cleanNodeId === "SystemProgram") {
      return {
        type: "program",
        tooltip: `
          <div class="space-y-2">
            <h3 class="font-bold text-sm">System Program</h3>
            <p class="text-xs">Native Solana Program</p>
            <p class="font-mono text-xs">11111111111111111111111111111111</p>
          </div>
        `,
      }
    }

    if (cleanNodeId === "TokenProgram") {
      return {
        type: "program",
        tooltip: `
          <div class="space-y-2">
            <h3 class="font-bold text-sm">Token Program</h3>
            <p class="text-xs">Solana Token Program</p>
            <p class="font-mono text-xs">TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</p>
          </div>
        `,
      }
    }

    return null
  }

  const generateAccountsDiagram = () => {
    let diagram = "classDiagram\n"

    // Add account classes
    idlData.accounts.forEach((account) => {
      const accountType = idlData.types.find((t) => t.name === account.name)

      diagram += `class "${account.name}" {\n`

      if (accountType && accountType.type.fields.length > 0) {
        accountType.type.fields.forEach((field) => {
          const fieldType =
            typeof field.type === "string"
              ? field.type
              : field.type.vec
                ? `Vec<${field.type.vec}>`
                : field.type.option
                  ? `Option<${field.type.option}>`
                  : JSON.stringify(field.type)

          diagram += `  +${fieldType} ${field.name}\n`
        })
      }

      diagram += "}\n"
    })

    // Add relationships between accounts
    idlData.instructions.forEach((instruction) => {
      instruction.accounts.forEach((account) => {
        if (account.pda) {
          // Find if the account is derived from another account
          account.pda.seeds.forEach((seed) => {
            if (seed.kind === "account" && seed.account) {
              const sourceAccount = idlData.accounts.find((a) => a.name === seed.account)
              const targetAccount = idlData.accounts.find((a) => a.name === account.name)

              if (sourceAccount && targetAccount) {
                diagram += `"${sourceAccount.name}" <.. "${targetAccount.name}" : derives\n`
              }
            }
          })
        }
      })
    })

    return diagram
  }

  const generateInstructionsDiagram = () => {
    let diagram = "classDiagram\n"

    // Add instruction classes
    idlData.instructions.forEach((instruction) => {
      diagram += `class "${instruction.name}" {\n`

      // Add arguments
      instruction.args.forEach((arg) => {
        diagram += `  +${arg.type} ${arg.name}\n`
      })

      diagram += "}\n"
    })

    // Add account classes that are used by instructions
    const usedAccounts = new Set<string>()

    idlData.instructions.forEach((instruction) => {
      instruction.accounts.forEach((account) => {
        const accountObj = idlData.accounts.find((a) => a.name === account.name)
        if (accountObj) {
          usedAccounts.add(account.name)
        }
      })
    })

    usedAccounts.forEach((accountName) => {
      const account = idlData.accounts.find((a) => a.name === accountName)
      if (account) {
        diagram += `class "${account.name}" {\n`
        diagram += "  +Account\n"
        diagram += "}\n"
      }
    })

    // Add relationships between instructions and accounts
    idlData.instructions.forEach((instruction) => {
      instruction.accounts.forEach((account) => {
        const accountObj = idlData.accounts.find((a) => a.name === account.name)
        if (accountObj) {
          diagram += `"${instruction.name}" --> "${account.name}" : uses\n`
        }
      })
    })

    return diagram
  }

  const generateFlowDiagram = () => {
    let diagram = "flowchart TB\n"

    // Add subgraphs for different types
    diagram += "subgraph Accounts\n"
    idlData.accounts.forEach((account) => {
      diagram += `  "${account.name}"["${account.name}"]\n`
    })
    diagram += "end\n\n"

    diagram += "subgraph Instructions\n"
    idlData.instructions.forEach((instruction) => {
      diagram += `  "${instruction.name}"["${instruction.name}"]\n`
    })
    diagram += "end\n\n"

    diagram += "subgraph Programs\n"
    diagram += '  "SystemProgram"["System Program"]\n'
    diagram += '  "TokenProgram"["Token Program"]\n'
    if (
      idlData.instructions.some((i) =>
        i.accounts.some((a) => a.address === "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      )
    ) {
      diagram += '  "AssociatedTokenProgram"["Associated Token Program"]\n'
    }
    diagram += "end\n\n"

    // Add connections between instructions and accounts
    idlData.instructions.forEach((instruction) => {
      instruction.accounts.forEach((account) => {
        const accountObj = idlData.accounts.find((a) => a.name === account.name)
        if (accountObj) {
          diagram += `"${instruction.name}" --> "${account.name}"\n`
        }

        // Add connections to system programs
        if (account.address === "11111111111111111111111111111111") {
          diagram += `"${instruction.name}" --> "SystemProgram"\n`
        } else if (account.address === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
          diagram += `"${instruction.name}" --> "TokenProgram"\n`
        } else if (account.address === "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") {
          diagram += `"${instruction.name}" --> "AssociatedTokenProgram"\n`
        }
      })
    })

    return diagram
  }

  return (
    <Card className="w-full h-[calc(100vh-250px)] min-h-[500px]">
      <CardHeader>
        <CardTitle>Mermaid Diagram</CardTitle>
        <CardDescription>Interactive diagram visualization of the IDL structure</CardDescription>
      </CardHeader>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <Button variant={diagramType === "flow" ? "default" : "outline"} onClick={() => setDiagramType("flow")}>
              Flow Diagram
            </Button>
            <Button
              variant={diagramType === "accounts" ? "default" : "outline"}
              onClick={() => setDiagramType("accounts")}
            >
              Accounts
            </Button>
            <Button
              variant={diagramType === "instructions" ? "default" : "outline"}
              onClick={() => setDiagramType("instructions")}
            >
              Instructions
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 border rounded-md overflow-hidden relative">
          <div
            ref={containerRef}
            className="w-full h-full overflow-hidden bg-card dark:bg-slate-900"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          ></div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Drag to pan, scroll to zoom, hover over nodes for details</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MermaidDiagramView

