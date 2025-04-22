import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { DataSourcesList } from "@/components/data-sources/data-sources-list"
import { DataSourcesHeader } from "@/components/data-sources/data-sources-header"

export const metadata: Metadata = {
  title: "数据源 | ETF交易系统",
  description: "管理您的ETF交易数据源",
}

export default function DataSourcesPage() {
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
        <DataSourcesHeader />
        <DataSourcesList />
      </div>
    </div>
  )
}
