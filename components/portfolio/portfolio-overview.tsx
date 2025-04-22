import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, Percent, TrendingUp } from "lucide-react"

export function PortfolioOverview() {
  const metrics = [
    {
      title: "总价值",
      value: "$125,430.28",
      change: "+4.32%",
      icon: DollarSign,
      positive: true,
    },
    {
      title: "日涨跌",
      value: "+$1,245.80",
      change: "+1.02%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "年初至今回报",
      value: "+18.45%",
      change: "+2.5%",
      icon: BarChart3,
      positive: true,
    },
    {
      title: "波动率",
      value: "12.38%",
      change: "-0.8%",
      icon: Percent,
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
