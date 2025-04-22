"use client"

import type { BacktestResult } from "@/lib/backtest/backtest-engine"

interface BacktestingStatsProps {
  result: BacktestResult
}

export function BacktestingStats({ result }: BacktestingStatsProps) {
  // 计算基准统计数据（这里使用简化的假设值）
  const benchmarkReturn = 8 // 假设基准年化回报为8%
  const benchmarkSharpe = 0.95 // 假设基准夏普比率
  const benchmarkMaxDrawdown = -18.5 // 假设基准最大回撤
  const benchmarkVolatility = 18.7 // 假设基准波动率
  const benchmarkBeta = 1.0 // 基准的贝塔值总是1

  // 准备统计数据
  const stats = [
    {
      name: "总回报",
      value: `${result.totalReturn >= 0 ? "+" : ""}${result.totalReturn.toFixed(2)}%`,
      benchmark: `+${benchmarkReturn.toFixed(2)}%`,
    },
    {
      name: "年化回报",
      value: `${result.annualReturn >= 0 ? "+" : ""}${result.annualReturn.toFixed(2)}%`,
      benchmark: `+${benchmarkReturn.toFixed(2)}%`,
    },
    {
      name: "夏普比率",
      value: result.sharpeRatio.toFixed(2),
      benchmark: benchmarkSharpe.toFixed(2),
    },
    {
      name: "最大回撤",
      value: `${result.maxDrawdown.toFixed(2)}%`,
      benchmark: `${benchmarkMaxDrawdown.toFixed(2)}%`,
    },
    {
      name: "波动率",
      value: `${(result.annualReturn / result.sharpeRatio).toFixed(2)}%`,
      benchmark: `${benchmarkVolatility.toFixed(2)}%`,
    },
    {
      name: "阿尔法",
      value: (result.annualReturn - benchmarkReturn).toFixed(2),
      benchmark: "N/A",
    },
    {
      name: "贝塔",
      value: ((result.annualReturn / benchmarkReturn) * 0.75).toFixed(2),
      benchmark: benchmarkBeta.toFixed(2),
    },
    {
      name: "胜率",
      value: `${result.winRate.toFixed(2)}%`,
      benchmark: "N/A",
    },
    {
      name: "盈亏比",
      value: result.profitFactor.toFixed(2),
      benchmark: "N/A",
    },
    {
      name: "平均交易",
      value:
        result.totalTrades > 0
          ? `${(((result.finalCapital - result.initialCapital) / result.totalTrades / result.initialCapital) * 100).toFixed(2)}%`
          : "N/A",
      benchmark: "N/A",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-3 border-b bg-muted/50 p-3">
          <div className="font-medium">指标</div>
          <div className="font-medium">策略</div>
          <div className="font-medium">基准</div>
        </div>
        <div className="divide-y">
          {stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-3 p-3">
              <div className="text-sm">{stat.name}</div>
              <div
                className={`text-sm font-medium ${
                  stat.value.startsWith("+") ? "text-green-600" : stat.value.startsWith("-") ? "text-red-600" : ""
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`text-sm ${
                  stat.benchmark.startsWith("+")
                    ? "text-green-600"
                    : stat.benchmark.startsWith("-")
                      ? "text-red-600"
                      : ""
                }`}
              >
                {stat.benchmark}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
