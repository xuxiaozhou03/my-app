import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ReportsList } from "@/components/reports/reports-list"
import { ReportsHeader } from "@/components/reports/reports-header"

export const metadata: Metadata = {
  title: "报告 | ETF交易系统",
  description: "查看和生成交易策略报告",
}

export default function ReportsPage() {
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
        <ReportsHeader />
        <ReportsList />
      </div>
    </div>
  )
}
