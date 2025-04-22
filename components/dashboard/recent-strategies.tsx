import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentStrategiesProps {
  className?: string
}

export function RecentStrategies({ className }: RecentStrategiesProps) {
  const strategies = [
    {
      id: "1",
      name: "移动平均线交叉",
      status: "active",
      performance: "+12.5%",
      lastUpdated: "2小时前",
    },
    {
      id: "2",
      name: "动量策略",
      status: "active",
      performance: "+8.3%",
      lastUpdated: "1天前",
    },
    {
      id: "3",
      name: "均值回归",
      status: "paused",
      performance: "-2.1%",
      lastUpdated: "3天前",
    },
    {
      id: "4",
      name: "机器学习预测",
      status: "testing",
      performance: "+5.7%",
      lastUpdated: "1周前",
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>最近策略</CardTitle>
        <CardDescription>您最近更新的交易策略</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{strategy.name}</p>
                <p className="text-xs text-muted-foreground">Updated {strategy.lastUpdated}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    strategy.status === "active" ? "default" : strategy.status === "paused" ? "secondary" : "outline"
                  }
                >
                  {strategy.status === "active"
                    ? "活跃"
                    : strategy.status === "paused"
                      ? "暂停"
                      : strategy.status === "testing"
                        ? "测试中"
                        : "草稿"}
                </Badge>
                <span
                  className={`text-sm font-medium ${
                    strategy.performance.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {strategy.performance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
