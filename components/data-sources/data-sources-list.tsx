"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, RefreshCw, ExternalLink } from "lucide-react"

export function DataSourcesList() {
  const [activeTab, setActiveTab] = useState("all")

  const dataSources = [
    {
      id: "1",
      name: "Alpha Vantage",
      type: "API",
      category: "market",
      status: "connected",
      lastSync: "2023-04-20T10:30:00Z",
      description: "全球证券的实时和历史市场数据",
    },
    {
      id: "2",
      name: "Quandl",
      type: "API",
      category: "financial",
      status: "connected",
      lastSync: "2023-04-19T14:45:00Z",
      description: "为投资专业人士提供的金融、经济和替代数据集",
    },
    {
      id: "3",
      name: "Coinbase Pro",
      type: "Exchange",
      category: "crypto",
      status: "error",
      lastSync: "2023-04-18T09:15:00Z",
      description: "具有实时市场数据的加密货币交易所",
    },
    {
      id: "4",
      name: "Binance",
      type: "Exchange",
      category: "crypto",
      status: "connected",
      lastSync: "2023-04-20T08:00:00Z",
      description: "具有广泛API功能的加密货币交易所",
    },
    {
      id: "5",
      name: "Yahoo Finance",
      type: "API",
      category: "market",
      status: "pending",
      lastSync: null,
      description: "股票、ETF和指数的综合市场数据",
    },
  ]

  const filteredSources =
    activeTab === "all" ? dataSources : dataSources.filter((source) => source.category === activeTab)

  return (
    <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">所有数据源</TabsTrigger>
        <TabsTrigger value="market">市场数据</TabsTrigger>
        <TabsTrigger value="financial">金融数据</TabsTrigger>
        <TabsTrigger value="crypto">加密货币</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSources.map((source) => (
            <Card key={source.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center">
                    {source.name}
                    <Badge
                      className="ml-2"
                      variant={
                        source.status === "connected"
                          ? "default"
                          : source.status === "error"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {source.status === "connected"
                        ? "已连接"
                        : source.status === "error"
                          ? "错误"
                          : source.status === "pending"
                            ? "待处理"
                            : source.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{source.type}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{source.description}</p>
                {source.lastSync && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    最后同步时间: {new Date(source.lastSync).toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    同步
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    查看
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
