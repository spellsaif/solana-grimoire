"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useIDLStore } from "@/store/idl-store";
import panzoom from "panzoom";
import { Instruction, InstructionAccount } from "@/lib/types";

const ERDiagram = () => {
  const idlData = useIDLStore((state) => state.idlData);
  const instructions = idlData?.instructions || [];
  const { theme } = useTheme();
  const [mermaidTheme, setMermaidTheme] = useState<"default" | "dark">("default");
  const diagramRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomInstance, setZoomInstance] = useState<any>(null);

  useEffect(() => {
    setMermaidTheme(theme === "dark" ? "dark" : "default");
  }, [theme]);

  useEffect(() => {
    if (!instructions.length) return; // Avoid unnecessary execution
    
    mermaid.initialize({
      startOnLoad: true,
      theme: mermaidTheme,
      securityLevel: "loose",
    });
    renderDiagrams();
  }, [mermaidTheme, instructions]);

  const renderDiagrams = async () => {
    if (!Array.isArray(instructions)) {
      console.error("Invalid instructions data");
      return;
    }
    
    diagramRefs.current.forEach(async (ref, index) => {
      if (!ref || !instructions[index]) return;
      
      try {
        ref.innerHTML = "";
        const diagram = generateInstructionDiagram(instructions[index]);
        if (!diagram) throw new Error("Generated diagram is empty");
        
        const { svg } = await mermaid.render(`diagram-${index}`, diagram);
        ref.innerHTML = svg;
      } catch (error) {
        console.error("Error rendering diagram:", error);
        ref.innerHTML = `<div class='p-4 text-red-500'>Error rendering diagram</div>`;
      }
    });
    applyPanZoom();
  };

  const applyPanZoom = () => {
    if (!containerRef.current) return;

    try {
      const zoom = panzoom(containerRef.current, {
        zoomDoubleClickSpeed: 1,
        maxZoom: 5,
        minZoom: 0.3,
        bounds: true,
        boundsPadding: 0.1,
      });
      setZoomInstance(zoom);
      containerRef.current.style.overflow = "hidden";
      
      containerRef.current.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;
        zoom.smoothZoom(
          containerRef.current!.clientWidth / 2,
          containerRef.current!.clientHeight / 2,
          scaleFactor
        );
      });
    } catch (error) {
      console.error("Error initializing zoom functionality:", error);
    }
  };

  const generateInstructionDiagram = (instruction: Instruction | undefined) => {
    if (!instruction || !instruction.name || !Array.isArray(instruction.accounts)) {
      console.warn("Invalid instruction data:", instruction);
      return "";
    }

    let diagram = "erDiagram\n";
    diagram += `${instruction.name} \n`;
    
    instruction.accounts.forEach((account: InstructionAccount) => {
      if (!account?.name) return; // Skip invalid accounts
      
      diagram += `${account.name} {\n \n}\n`;
      diagram += `${instruction.name} ||--o| ${account.name} : ""\n`;
    });

    return diagram;
  };

  return (
    <Card className="anime-card">
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => zoomInstance?.smoothZoom(0, 0, 1.2)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => zoomInstance?.smoothZoom(0, 0, 0.8)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="border rounded-md p-4 min-h-[400px] anime-diagram-container overflow-hidden relative">
          {instructions.length > 0 ? (
            instructions.map((instruction: Instruction, index: number) => (
              <div key={index} className="mb-8 w-full max-w-full overflow-hidden">
                <div ref={(el) => (diagramRefs.current[index] = el)} className="w-full h-full overflow-hidden"></div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No instructions available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ERDiagram;
