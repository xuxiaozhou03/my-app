"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface PortfolioPositionsProps {
  className?: string
}

export function PortfolioPositions({ className }: PortfolioPositionsProps) {
  const [activeTab, setActiveTab] = useState("all")

  const positions = [
    {
      id: "1",
      symbol: "SPY",
      name: "SPDR标普500ETF",
      category: "us-equity",
      shares: 85,
      price: 450.25,
      value: 38271.25,
      change: "+1.2%",
      allocation: "30.5%",
    },
    {
      id: "2",
      symbol: "QQQ",
      name: "Invesco纳斯达克100ETF",
      category: "us-equity",
      shares: 40,
      price: 365.8,
      value: 14632.0,
      change: "+1.8%",
      allocation: "11.7%",
    },
    {
      id: "3",
      symbol: "VEA",
      name: "Vanguard富时发达市场ETF",
      category: "international",
      shares: 250,
      price: 48.35,
      value: 12087.5,
      change: "-0.5%",
      allocation: "9.6%",
    },
    {
      id: "4",
      symbol: "VWO",
      name: "Vanguard富时新兴市场ETF",
      category: "international",
      shares: 200,
      price: 42.15,
      value: 8430.0,
      change: "-0.8%",
      allocation: "6.7%",
    },
    {
      id: "5",
      symbol: "AGG",
      name: "iShares核心美国综合债券ETF",
      category: "fixed-income",
      shares: 150,
      price: 108.5,
      value: 16275.0,
      change: "+0.2%",
      allocation: "13.0%",
    },
    {
      id: "6",
      symbol: "GLD",
      name: "SPDR黄金股份ETF",
      category: "commodity",
      shares: 70,
      price: 175.3,
      value: 12271.0,
      change: "+0.5%",
      allocation: "9.8%",
    },
    {
      id: "7",
      symbol: "CASH",
      name: "现金及等价物",
      category: "cash",
      shares: null,
      price: null,
      value: 12500.0,
      change: "0.0%",
      allocation: "10.0%",
    },
  ]

  const filteredPositions =
    activeTab === "all" ? positions : positions.filter((position) => position.category === activeTab)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>投资组合持仓</CardTitle>
        <CardDescription>当前持仓和表现</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="us-equity">美国股票</TabsTrigger>
            <TabsTrigger value="international">国际市场</TabsTrigger>
            <TabsTrigger value="fixed-income">固定收益</TabsTrigger>
            <TabsTrigger value="commodity">大宗商品</TabsTrigger>
            <TabsTrigger value="cash">现金</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="rounded-md border">
              <div className="grid grid-cols-7 border-b bg-muted/50 p-3">
                <div className="font-medium">代码</div>
                <div className="col-span-2 font-medium">名称</div>
                <div className="font-medium">数量</div>
                <div className="font-medium">价格</div>
                <div className="font-medium">价值</div>
                <div className="font-medium">配置比例</div>
              </div>
              <div className="divide-y">
                {filteredPositions.map((position) => (
                  <div key={position.id} className="grid grid-cols-7 p-3">
                    <div className="text-sm font-medium">{position.symbol}</div>
                    <div className="col-span-2 text-sm">{position.name}</div>
                    <div className="text-sm">{position.shares || "-"}</div>
                    <div className="text-sm">{position.price ? `$${position.price.toFixed(2)}` : "-"}</div>
                    <div className="text-sm">${position.value.toFixed(2)}</div>
                    <div className="text-sm">
                      <Badge variant="outline">{position.allocation}</Badge>
                      <span
                        className={`ml-2 text-xs ${
                          position.change.startsWith("+")
                            ? "text-green-600"
                            : position.change.startsWith("-")
                              ? "text-red-600"
                              : ""
                        }`}
                      >
                        {position.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
