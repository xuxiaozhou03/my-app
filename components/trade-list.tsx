"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TradeList({ trades }) {
  if (!trades || trades.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无交易记录</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead>操作</TableHead>
            <TableHead className="text-right">价格</TableHead>
            <TableHead className="text-right">数量</TableHead>
            <TableHead className="text-right">交易金额</TableHead>
            <TableHead className="text-right">交易成本</TableHead>
            <TableHead className="text-right">剩余资金</TableHead>
            <TableHead className="text-right">总资产</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, index) => (
            <TableRow key={index}>
              <TableCell>{trade.date}</TableCell>
              <TableCell>
                <Badge variant={trade.action === "买入" ? "default" : "destructive"}>{trade.action}</Badge>
              </TableCell>
              <TableCell className="text-right">{trade.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{trade.shares}</TableCell>
              <TableCell className="text-right">{(trade.price * trade.shares).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {trade.totalCost.toFixed(2)}
                <span className="text-xs text-muted-foreground ml-1">({trade.costPercentage})</span>
              </TableCell>
              <TableCell className="text-right">{trade.capital.toFixed(2)}</TableCell>
              <TableCell className="text-right">{trade.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
