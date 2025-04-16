"use client"

import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

export default function EquityCurveChart({ equityCurve, initialCapital }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!equityCurve || equityCurve.length === 0 || !chartRef.current) return

    // Destroy previous chart instance if exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data
    const labels = equityCurve.map((point) => point.date)
    const equityData = equityCurve.map((point) => point.equity)
    const positionData = equityCurve.map((point) => (point.position > 0 ? 1 : 0))

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "资金曲线",
            data: equityData,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            tension: 0.1,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "持仓状态",
            data: positionData,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            pointRadius: 0,
            stepped: true,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "日期",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "资金",
            },
            grid: {
              drawOnChartArea: true,
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            min: 0,
            max: 1,
            title: {
              display: true,
              text: "持仓状态",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ""
                if (label === "资金曲线") {
                  return `${label}: ${context.parsed.y.toFixed(2)} 元`
                } else if (label === "持仓状态") {
                  return `${label}: ${context.parsed.y > 0 ? "持仓" : "空仓"}`
                }
                return label
              },
            },
          },
          annotation: {
            annotations: {
              initialCapitalLine: {
                type: "line",
                yMin: initialCapital,
                yMax: initialCapital,
                borderColor: "rgb(255, 159, 64)",
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  content: "初始资金",
                  display: true,
                  position: "start",
                },
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [equityCurve, initialCapital])

  return <canvas ref={chartRef} className="w-full h-full"></canvas>
}
