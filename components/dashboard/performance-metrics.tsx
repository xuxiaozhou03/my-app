import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, Percent, Activity } from "lucide-react"

export function PerformanceMetrics() {
  const metrics = [
    {
      title: "总回报",
      value: "+24.5%",
      change: "+4.3%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "夏普比率",
      value: "1.85",
      change: "+0.2",
      icon: BarChart3,
      positive: true,
    },
    {
      title: "最大回撤",
      value: "-12.3%",
      change: "-2.1%",
      icon: Percent,
      positive: false,
    },
    {
      title: "胜率",
      value: "68%",
      change: "+3%",
      icon: Activity,
      positive: true,
    },
  ]

  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {metric.positive ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
              )}
              <span className={metric.positive ? "text-green-600" : "text-red-600"}>{metric.change}</span>
              <span className="ml-1">相比上期</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
