import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { PortfolioAllocation } from "@/components/portfolio/portfolio-allocation"
import { PortfolioPositions } from "@/components/portfolio/portfolio-positions"

export const metadata: Metadata = {
  title: "投资组合 | ETF交易系统",
  description: "管理您的投资组合",
}

export default function PortfolioPage() {
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
            <h2 className="text-3xl font-bold tracking-tight">投资组合</h2>
            <p className="text-muted-foreground">管理您的投资组合和资产配置</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PortfolioOverview />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <PortfolioAllocation className="col-span-3" />
          <PortfolioPositions className="col-span-4" />
        </div>
      </div>
    </div>
  )
}
