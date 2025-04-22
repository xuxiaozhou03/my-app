"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    date: "Jan",
    value: 2400,
    benchmark: 2200,
  },
  {
    date: "Feb",
    value: 1398,
    benchmark: 1800,
  },
  {
    date: "Mar",
    value: 9800,
    benchmark: 8500,
  },
  {
    date: "Apr",
    value: 3908,
    benchmark: 3700,
  },
  {
    date: "May",
    value: 4800,
    benchmark: 4100,
  },
  {
    date: "Jun",
    value: 3800,
    benchmark: 3500,
  },
  {
    date: "Jul",
    value: 4300,
    benchmark: 4000,
  },
]

interface OverviewProps {
  className?: string
}

export function Overview({ className }: OverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>绩效概览</CardTitle>
        <CardDescription>将您的策略表现与基准进行比较</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "策略",
              color: "hsl(var(--chart-1))",
            },
            benchmark: {
              label: "基准",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  style: { fill: "var(--color-value)", opacity: 0.8 },
                }}
                stroke="var(--color-value)"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  style: { fill: "var(--color-benchmark)", opacity: 0.8 },
                }}
                stroke="var(--color-benchmark)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
