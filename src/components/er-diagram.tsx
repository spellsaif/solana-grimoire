"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useIDLStore } from "@/store/idl-store";
import panzoom from "panzoom";
import { Account, Instruction, InstructionAccount } from "@/lib/types";

const ERDiagram = () => {
  const instructions = useIDLStore((state) => state.idlData?.instructions || []);
  const { theme } = useTheme();
  const [mermaidTheme, setMermaidTheme] = useState<"default" | "dark">("default");
  const diagramRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomInstance, setZoomInstance] = useState<any>(null);

  useEffect(() => {
    setMermaidTheme(theme === "dark" ? "dark" : "default");
  }, [theme]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: mermaidTheme,
      securityLevel: "loose",
    });
    renderDiagrams();
  }, [mermaidTheme, instructions]);

  const renderDiagrams = async () => {
    diagramRefs.current.forEach(async (ref, index) => {
      if (!ref) return;
      try {
        ref.innerHTML = "";
        const diagram = generateInstructionDiagram(instructions[index]);
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
    if (containerRef.current) {
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
    }
  };

  // Generate ER Diagram instead of a flowchart
  const generateInstructionDiagram = (instruction: any) => {
    let diagram = "erDiagram\n";

    // Define Instruction as an entity
    diagram += `${instruction.name} \n`;

    instruction.accounts.forEach((account:InstructionAccount) => {
      // Define Account as an entity
      diagram += `${account.name} {\n \n}\n`;
      // Define relationship (Instruction has many Accounts)
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
          {instructions.map((instruction: Instruction, index: number) => (
            <div key={index} className="mb-8 w-full max-w-full overflow-hidden">
              <div ref={(el) => (diagramRefs.current[index] = el)} className="w-full h-full overflow-hidden"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ERDiagram;
