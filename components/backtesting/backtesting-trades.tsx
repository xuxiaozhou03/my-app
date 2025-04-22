"use client"

import { format } from "date-fns"
import type { BacktestResult } from "@/lib/backtest/backtest-engine"

interface BacktestingTradesProps {
  result: BacktestResult
}

export function BacktestingTrades({ result }: BacktestingTradesProps) {
  // 过滤出已关闭的交易
  const closedTrades = result.trades.filter((trade) => trade.status === "CLOSED")

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-6 border-b bg-muted/50 p-3">
          <div className="font-medium">类型</div>
          <div className="font-medium">日期</div>
          <div className="font-medium">价格</div>
          <div className="font-medium">数量</div>
          <div className="font-medium">价值</div>
          <div className="font-medium">盈亏</div>
        </div>
        <div className="divide-y">
          {closedTrades.map((trade, index) => (
            <div key={index} className="grid grid-cols-6 p-3">
              <div className={`text-sm font-medium ${trade.side === "LONG" ? "text-green-600" : "text-red-600"}`}>
                {trade.side === "LONG" ? "买入" : "卖出"}
              </div>
              <div className="text-sm">{format(trade.entryDate, "yyyy-MM-dd")}</div>
              <div className="text-sm">${trade.entryPrice.toFixed(2)}</div>
              <div className="text-sm">{trade.shares}</div>
              <div className="text-sm">${(trade.shares * trade.entryPrice).toFixed(2)}</div>
              <div
                className={`text-sm font-medium ${
                  trade.pnl > 0 ? "text-green-600" : trade.pnl < 0 ? "text-red-600" : ""
                }`}
              >
                {trade.pnl > 0 ? "+" : ""}
                {trade.pnl.toFixed(2)}
              </div>
            </div>
          ))}
          {closedTrades.length === 0 && <div className="p-4 text-center text-muted-foreground">没有交易记录</div>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium text-muted-foreground">总交易次数</div>
          <div className="text-2xl font-bold">{result.totalTrades}</div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium text-muted-foreground">胜率</div>
          <div className="text-2xl font-bold text-green-600">{result.winRate.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  )
}
