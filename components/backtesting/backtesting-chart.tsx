"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"
import type { BacktestResult } from "@/lib/backtest/backtest-engine"
import { format } from "date-fns"

interface BacktestingChartProps {
  result: BacktestResult
}

export function BacktestingChart({ result }: BacktestingChartProps) {
  // 准备图表数据
  const chartData = result.equityCurve.map((point) => {
    // 计算基准值（假设初始值与策略相同，但增长率为市场平均水平，如8%年化）
    const daysSinceStart = (point.date.getTime() - result.equityCurve[0].date.getTime()) / (1000 * 60 * 60 * 24)
    const annualizedReturn = 0.08 // 8% 年化回报率
    const dailyReturn = Math.pow(1 + annualizedReturn, 1 / 365) - 1
    const benchmarkValue = result.initialCapital * Math.pow(1 + dailyReturn, daysSinceStart)

    return {
      date: format(point.date, "yyyy-MM-dd"),
      strategy: point.equity,
      benchmark: benchmarkValue,
    }
  })

  // 计算总回报和年化回报
  const totalReturn = ((result.finalCapital - result.initialCapital) / result.initialCapital) * 100
  const firstDate = result.equityCurve[0]?.date
  const lastDate = result.equityCurve[result.equityCurve.length - 1]?.date
  let annualReturn = 0

  if (firstDate && lastDate) {
    const years = (lastDate.getTime() - firstDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
    annualReturn = (Math.pow(result.finalCapital / result.initialCapital, 1 / years) - 1) * 100
  }

  // 计算基准回报
  const benchmarkTotalReturn =
    ((chartData[chartData.length - 1]?.benchmark - result.initialCapital) / result.initialCapital) * 100
  const benchmarkAnnualReturn = 8 // 假设基准年化回报为8%

  return (
    <div className="space-y-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MM/dd")} minTickGap={30} />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              labelFormatter={(label) => format(new Date(label), "yyyy-MM-dd")}
            />
            <Legend />
            <Line
              name="策略"
              type="monotone"
              dataKey="strategy"
              strokeWidth={2}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line name="基准" type="monotone" dataKey="benchmark" strokeWidth={2} stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium text-muted-foreground">总回报</div>
          <div className={`text-2xl font-bold ${totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn.toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">
            对比基准: {benchmarkTotalReturn >= 0 ? "+" : ""}
            {benchmarkTotalReturn.toFixed(2)}%
          </div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium text-muted-foreground">年化回报</div>
          <div className={`text-2xl font-bold ${annualReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
            {annualReturn >= 0 ? "+" : ""}
            {annualReturn.toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">对比基准: +{benchmarkAnnualReturn.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  )
}
