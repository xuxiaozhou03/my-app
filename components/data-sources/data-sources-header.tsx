"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function DataSourcesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">数据源</h2>
        <p className="text-muted-foreground">管理您的市场数据源和连接</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        添加数据源
      </Button>
    </div>
  )
}
