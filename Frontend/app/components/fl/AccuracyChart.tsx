"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Legend, Tooltip);

export interface AccuracyChartHandle {
  addData: (round: string, global: number, h1: number, h2: number, h3: number) => void;
  reset: () => void;
}

const AccuracyChart = forwardRef<AccuracyChartHandle>(function AccuracyChart(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Global",
            data: [],
            borderColor: "#059669",
            backgroundColor: "rgba(5,150,105,0.1)",
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.4,
            fill: true,
          },
          {
            label: "H001",
            data: [],
            borderColor: "#0284c7",
            borderWidth: 1.5,
            pointRadius: 2,
            tension: 0.4,
            borderDash: [4, 2],
          },
          {
            label: "H002",
            data: [],
            borderColor: "#d97706",
            borderWidth: 1.5,
            pointRadius: 2,
            tension: 0.4,
            borderDash: [4, 2],
          },
          {
            label: "H003",
            data: [],
            borderColor: "#2563eb",
            borderWidth: 1.5,
            pointRadius: 2,
            tension: 0.4,
            borderDash: [4, 2],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
          legend: {
            labels: {
              color: "#64748b",
              font: { family: "Space Mono", size: 10 },
              boxWidth: 12,
            },
          },
          tooltip: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            titleColor: "#64748b",
            bodyFont: { family: "Space Mono", size: 11 },
          },
        },
        scales: {
          x: {
            grid: { color: "#e2e8f0" },
            ticks: { color: "#64748b", font: { family: "Space Mono", size: 10 } },
          },
          y: {
            grid: { color: "#e2e8f0" },
            ticks: {
              color: "#64748b",
              font: { family: "Space Mono", size: 10 },
              callback: (v) => Number(v).toFixed(0) + "%",
            },
            min: 55,
            max: 100,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    addData(round: string, global: number, h1: number, h2: number, h3: number) {
      const chart = chartRef.current;
      if (!chart) return;
      chart.data.labels!.push(round);
      chart.data.datasets[0].data.push(global);
      chart.data.datasets[1].data.push(h1);
      chart.data.datasets[2].data.push(h2);
      chart.data.datasets[3].data.push(h3);
      chart.update();
    },
    reset() {
      const chart = chartRef.current;
      if (!chart) return;
      chart.data.labels = [];
      chart.data.datasets.forEach((d) => (d.data = []));
      chart.update();
    },
  }));

  return (
    <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
        <div className="font-mono text-[11px] text-muted uppercase tracking-widest">
          Global Model Accuracy — per round
        </div>
      </div>
      <div className="p-5">
        <canvas ref={canvasRef} height="160" />
      </div>
    </div>
  );
});

export default AccuracyChart;
