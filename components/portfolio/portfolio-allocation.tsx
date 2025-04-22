"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PortfolioAllocationProps {
  className?: string
}

export function PortfolioAllocation({ className }: PortfolioAllocationProps) {
  const data = [
    { name: "美国股票", value: 45 },
    { name: "国际市场", value: 20 },
    { name: "固定收益", value: 15 },
    { name: "大宗商品", value: 10 },
    { name: "现金", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A4A4A4"]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>资产配置</CardTitle>
        <CardDescription>按资产类别划分的当前投资组合配置</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
