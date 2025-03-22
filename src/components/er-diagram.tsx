"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useIDLStore } from "@/store/idl-store";
import { Instruction, InstructionAccount } from "@/lib/types";

const ERDiagram = () => {
  const idlData = useIDLStore((state) => state.idlData);
  const instructions = idlData?.instructions || [];
  const { theme } = useTheme();
  const [mermaidTheme, setMermaidTheme] = useState<"default" | "dark">("default");

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMermaidTheme(theme === "dark" ? "dark" : "default");
  }, [theme]);

  useEffect(() => {
    if (!instructions.length) return;
    mermaid.initialize({ startOnLoad: true, theme: mermaidTheme, securityLevel: "loose" });
    renderDiagrams();
  }, [mermaidTheme, instructions]);

  const renderDiagrams = async () => {
    if (!instructions.length) return;
    
    containerRef.current?.querySelectorAll(".diagram-container").forEach((el) => el.remove());

    instructions.forEach(async (instruction:Instruction, index:Number) => {
      const diagramContainer = document.createElement("div");
      diagramContainer.className = "diagram-container";
      containerRef.current?.appendChild(diagramContainer);

      try {
        const diagram = generateInstructionDiagram(instruction);
        const { svg } = await mermaid.render(`diagram-${index}`, diagram);
        diagramContainer.innerHTML = svg;
      } catch (error) {
        diagramContainer.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram</div>`;
      }
    });
  };

  const generateInstructionDiagram = (instruction: Instruction) => {
    if (!instruction || !instruction.name || !Array.isArray(instruction.accounts)) return "";
    
    let diagram = "erDiagram\n";
    diagram += `${instruction.name} \n`;
    
    instruction.accounts.forEach((account: InstructionAccount) => {
      if (!account?.name) return;
      diagram += `${account.name} {\n \n}\n`;
      diagram += `${instruction.name} ||--o| ${account.name} : ""\n`;
    });

    return diagram;
  };

  // 📌 Zooming
  const handleZoom = (factor: number) => {
    setZoomLevel((prevZoom) => Math.max(0.3, Math.min(5, prevZoom * factor)));
  };

  // 📌 Panning (Dragging)
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!contentRef.current) return;
    setIsDragging(true);
    setStartPos({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !contentRef.current) return;
    const newX = event.clientX - startPos.x;
    const newY = event.clientY - startPos.y;
    setOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <Card className="anime-card">
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleZoom(1.2)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleZoom(0.8)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative overflow-hidden min-h-[400px]">
        <div
          ref={containerRef}
          className="border rounded-md p-4 relative w-full h-full overflow-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
          }}
        >
          <div ref={contentRef} className="w-full h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ERDiagram;
