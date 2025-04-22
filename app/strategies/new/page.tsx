import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { StrategyForm } from "@/components/strategies/strategy-form"

export const metadata: Metadata = {
  title: "创建策略 | ETF交易系统",
  description: "创建新的交易策略",
}

export default function CreateStrategyPage() {
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
            <h2 className="text-3xl font-bold tracking-tight">创建策略</h2>
            <p className="text-muted-foreground">为您的投资组合定义新的交易策略</p>
          </div>
        </div>
        <StrategyForm />
      </div>
    </div>
  )
}
