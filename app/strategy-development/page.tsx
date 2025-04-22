import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { StrategyDevelopment } from "@/components/strategy-development/strategy-development"

export const metadata: Metadata = {
  title: "策略开发 | ETF交易系统",
  description: "开发和测试交易策略",
}

export default function StrategyDevelopmentPage() {
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
            <h2 className="text-3xl font-bold tracking-tight">策略开发</h2>
            <p className="text-muted-foreground">开发、测试和优化您的交易策略</p>
          </div>
        </div>
        <StrategyDevelopment />
      </div>
    </div>
  )
}
