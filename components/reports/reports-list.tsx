"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, BarChart, PieChart, TrendingUp } from "lucide-react"

export function ReportsList() {
  const [activeTab, setActiveTab] = useState("all")

  const reports = [
    {
      id: "1",
      name: "月度绩效报告",
      type: "performance",
      date: "2023-04-01",
      strategy: "移动平均线交叉",
      format: "PDF",
      icon: TrendingUp,
    },
    {
      id: "2",
      name: "策略回测报告",
      type: "backtest",
      date: "2023-03-15",
      strategy: "动量策略",
      format: "PDF",
      icon: BarChart,
    },
    {
      id: "3",
      name: "投资组合配置报告",
      type: "portfolio",
      date: "2023-04-01",
      strategy: "所有策略",
      format: "PDF",
      icon: PieChart,
    },
    {
      id: "4",
      name: "交易分析报告",
      type: "trades",
      date: "2023-03-01",
      strategy: "均值回归",
      format: "PDF",
      icon: FileText,
    },
    {
      id: "5",
      name: "风险评估报告",
      type: "risk",
      date: "2023-02-15",
      strategy: "所有策略",
      format: "PDF",
      icon: FileText,
    },
  ]

  const filteredReports = activeTab === "all" ? reports : reports.filter((report) => report.type === activeTab)

  return (
    <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">所有报告</TabsTrigger>
        <TabsTrigger value="performance">绩效</TabsTrigger>
        <TabsTrigger value="backtest">回测</TabsTrigger>
        <TabsTrigger value="portfolio">投资组合</TabsTrigger>
        <TabsTrigger value="trades">交易</TabsTrigger>
        <TabsTrigger value="risk">风险</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">策略: {report.strategy}</p>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    查看
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    下载
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
