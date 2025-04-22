"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function ReportsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">报告</h2>
        <p className="text-muted-foreground">为您的交易策略生成和查看报告</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        生成报告
      </Button>
    </div>
  )
}
