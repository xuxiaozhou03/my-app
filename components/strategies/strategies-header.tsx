"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function StrategiesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">策略</h2>
        <p className="text-muted-foreground">创建和管理您的交易策略</p>
      </div>
      <Link href="/strategies/new">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新建策略
        </Button>
      </Link>
    </div>
  )
}
