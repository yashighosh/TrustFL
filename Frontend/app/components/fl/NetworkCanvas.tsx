"use client";

import { useEffect, useRef, useCallback } from "react";

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    if (!wrap) return;

    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const nodes = [
      { x: W * 0.15, y: H * 0.3, label: "H001", color: "#0284c7", r: 22 },
      { x: W * 0.15, y: H * 0.7, label: "H002", color: "#d97706", r: 22 },
      { x: W * 0.85, y: H * 0.3, label: "H003", color: "#2563eb", r: 22 },
      { x: W * 0.5, y: H * 0.5, label: "FL\nServer", color: "#059669", r: 30 },
    ];

    let tick = 0;

    function render() {
      ctx!.clearRect(0, 0, W, H);
      tick++;

      // Lines from hospital nodes to FL server
      [0, 1, 2].forEach((i) => {
        const a = nodes[i];
        const b = nodes[3];
        const dashOff = (tick * 0.5) % 20;

        ctx!.save();
        ctx!.setLineDash([6, 4]);
        ctx!.lineDashOffset = -dashOff;
        ctx!.strokeStyle = a.color + "55";
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
        ctx!.restore();

        // Moving data packet
        const t = ((tick * 0.8 + i * 60) % 180) / 180;
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;
        ctx!.beginPath();
        ctx!.arc(px, py, 3, 0, Math.PI * 2);
        ctx!.fillStyle = a.color;
        ctx!.fill();
      });

      // Draw nodes
      nodes.forEach((n) => {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = n.color + "22";
        ctx!.fill();
        ctx!.strokeStyle = n.color + "88";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        ctx!.fillStyle = n.color;
        ctx!.font = n.r > 25 ? "bold 11px Space Mono" : "bold 10px Space Mono";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        if (n.label.includes("\n")) {
          const parts = n.label.split("\n");
          ctx!.fillText(parts[0], n.x, n.y - 7);
          ctx!.fillText(parts[1], n.x, n.y + 7);
        } else {
          ctx!.fillText(n.label, n.x, n.y);
        }
      });

      const bx = W * 0.85;
      const by = H * 0.7;
      ctx!.beginPath();
      ctx!.arc(bx, by, 22, 0, Math.PI * 2);
      ctx!.fillStyle = "#dc262622";
      ctx!.fill();
      ctx!.strokeStyle = "#dc262688";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      const dashOff2 = (tick * 0.3) % 20;
      ctx!.save();
      ctx!.setLineDash([6, 4]);
      ctx!.lineDashOffset = -dashOff2;
      ctx!.strokeStyle = "#dc262655";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(nodes[3].x, nodes[3].y);
      ctx!.lineTo(bx, by);
      ctx!.stroke();
      ctx!.restore();

      ctx!.fillStyle = "#dc2626";
      ctx!.font = "bold 9px Space Mono";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText("Block", bx, by - 6);
      ctx!.fillText("Chain", bx, by + 6);

      animFrameRef.current = requestAnimationFrame(render);
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    render();
  }, []);

  useEffect(() => {
    draw();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  return (
    <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
        <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Network Topology</div>
        <span className="inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] bg-green-light text-neon-green border border-neon-green/20">
          3 nodes · FedAvg
        </span>
      </div>
      <div className="relative h-[280px]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
