'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration, ChartData, TooltipItem } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface DataChartProps {
  data: number[];
  labels: string[];
  color: string;
  fillColor: string;
  unit: string;
}

export default function DataChart({ data, labels, color, fillColor, unit }: DataChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: unit,
            data: data,
            backgroundColor: fillColor,
            borderColor: color,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 0.3,
            to: 0.3,
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(200, 200, 200, 0.75)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context: TooltipItem<'line'>) {
                return `${context.parsed.y} ${unit}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#888',
              font: {
                size: 10,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.15)',
            },
            ticks: {
              color: '#888',
              font: {
                size: 10,
              },
              callback: function(value: number) {
                return `${value} ${unit}`;
              }
            },
          },
        },
      },
    } as ChartConfiguration);

    // Update chart when data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, labels, color, fillColor, unit]);

  return (
    <div className="h-60 w-full">
      <canvas ref={chartRef} />
    </div>
  );
} 