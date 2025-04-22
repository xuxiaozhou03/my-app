"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { BacktestingForm } from "@/components/backtesting/backtesting-form"
import { BacktestingResults } from "@/components/backtesting/backtesting-results"

export default function BacktestingPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBacktestComplete = () => {
    // 通过更新key来强制重新渲染结果组件
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">回测</h2>
            <p className="text-muted-foreground">使用历史数据测试您的策略</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <BacktestingForm onBacktestComplete={handleBacktestComplete} />
          <BacktestingResults key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
