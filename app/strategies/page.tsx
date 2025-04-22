import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { StrategiesList } from "@/components/strategies/strategies-list"
import { StrategiesHeader } from "@/components/strategies/strategies-header"

export const metadata: Metadata = {
  title: "策略 | ETF交易系统",
  description: "管理您的交易策略",
}

export default function StrategiesPage() {
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
        <StrategiesHeader />
        <StrategiesList />
      </div>
    </div>
  )
}
