"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BacktestingChart } from "@/components/backtesting/backtesting-chart"
import { BacktestingStats } from "@/components/backtesting/backtesting-stats"
import { BacktestingTrades } from "@/components/backtesting/backtesting-trades"
import { BacktestService } from "@/lib/services/backtest-service"
import type { BacktestResult } from "@/lib/backtest/backtest-engine"

export function BacktestingResults() {
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [activeTab, setActiveTab] = useState("performance")

  // 获取最新的回测结果
  useEffect(() => {
    const backtestService = BacktestService.getInstance()
    const lastResult = backtestService.getLastResult()
    if (lastResult) {
      setResult(lastResult)
    }
  }, [])

  // 如果没有结果，显示提示信息
  if (!result) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>回测结果</CardTitle>
          <CardDescription>策略性能分析</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">尚无回测结果。请配置参数并运行回测。</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>回测结果 - {result.strategyName}</CardTitle>
        <CardDescription>策略性能分析</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="performance">性能</TabsTrigger>
            <TabsTrigger value="stats">统计</TabsTrigger>
            <TabsTrigger value="trades">交易</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <BacktestingChart result={result} />
          </TabsContent>

          <TabsContent value="stats">
            <BacktestingStats result={result} />
          </TabsContent>

          <TabsContent value="trades">
            <BacktestingTrades result={result} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
