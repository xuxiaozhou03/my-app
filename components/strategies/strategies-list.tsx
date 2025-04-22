"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Play, Pause, BarChart2 } from "lucide-react"

export function StrategiesList() {
  const [activeTab, setActiveTab] = useState("all")

  const strategies = [
    {
      id: "1",
      name: "移动平均线交叉",
      type: "技术分析",
      category: "trend",
      status: "active",
      performance: "+12.5%",
      description: "基于两个移动平均线交叉的策略",
      lastUpdated: "2023-04-20T10:30:00Z",
    },
    {
      id: "2",
      name: "动量策略",
      type: "技术分析",
      category: "momentum",
      status: "active",
      performance: "+8.3%",
      description: "使用相对强度指标捕捉价格动量",
      lastUpdated: "2023-04-19T14:45:00Z",
    },
    {
      id: "3",
      name: "均值回归",
      type: "统计分析",
      category: "mean-reversion",
      status: "paused",
      performance: "-2.1%",
      description: "利用价格回归均值的趋势",
      lastUpdated: "2023-04-18T09:15:00Z",
    },
    {
      id: "4",
      name: "机器学习预测",
      type: "机器学习",
      category: "ml",
      status: "testing",
      performance: "+5.7%",
      description: "使用机器学习算法预测价格走势",
      lastUpdated: "2023-04-17T16:20:00Z",
    },
    {
      id: "5",
      name: "波动率突破",
      type: "技术分析",
      category: "volatility",
      status: "draft",
      performance: "N/A",
      description: "识别并交易低波动率期间的突破",
      lastUpdated: "2023-04-16T11:10:00Z",
    },
  ]

  const filteredStrategies =
    activeTab === "all"
      ? strategies
      : strategies.filter((strategy) => strategy.category === activeTab || strategy.status === activeTab)

  return (
    <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">所有策略</TabsTrigger>
        <TabsTrigger value="active">活跃</TabsTrigger>
        <TabsTrigger value="paused">暂停</TabsTrigger>
        <TabsTrigger value="testing">测试中</TabsTrigger>
        <TabsTrigger value="draft">草稿</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStrategies.map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center">
                    {strategy.name}
                    <Badge
                      className="ml-2"
                      variant={
                        strategy.status === "active"
                          ? "default"
                          : strategy.status === "paused"
                            ? "secondary"
                            : strategy.status === "testing"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {strategy.status === "active"
                        ? "活跃"
                        : strategy.status === "paused"
                          ? "暂停"
                          : strategy.status === "testing"
                            ? "测试中"
                            : strategy.status === "draft"
                              ? "草稿"
                              : strategy.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{strategy.type}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{strategy.description}</p>
                {strategy.performance !== "N/A" && (
                  <p
                    className={`mt-2 text-sm font-medium ${
                      strategy.performance.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    表现: {strategy.performance}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  最后更新: {new Date(strategy.lastUpdated).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/strategies/${strategy.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  {strategy.status === "active" ? (
                    <Button variant="outline" size="sm">
                      <Pause className="mr-2 h-4 w-4" />
                      暂停
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      激活
                    </Button>
                  )}
                  <Link href={`/backtesting?strategy=${strategy.id}`}>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      回测
                    </Button>
                  </Link>
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
