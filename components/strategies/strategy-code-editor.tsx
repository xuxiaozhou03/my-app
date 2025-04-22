"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StrategyCodeEditor() {
  const [code, setCode] = useState(`// Moving Average Crossover Strategy
  
function initialize() {
  // Define the strategy parameters
  this.fastPeriod = 12;
  this.slowPeriod = 26;
  this.signalPeriod = 9;
  
  // Initialize indicators
  this.fastMA = new MovingAverage(this.fastPeriod);
  this.slowMA = new MovingAverage(this.slowPeriod);
  this.signal = new MovingAverage(this.signalPeriod);
}

function onData(data) {
  // Update indicators with new data
  const fastValue = this.fastMA.update(data.close);
  const slowValue = this.slowMA.update(data.close);
  
  // Calculate MACD
  const macd = fastValue - slowValue;
  const signalValue = this.signal.update(macd);
  
  // Generate trading signals
  if (macd > signalValue && this.position <= 0) {
    // Bullish crossover - buy signal
    this.buy();
  } else if (macd < signalValue && this.position >= 0) {
    // Bearish crossover - sell signal
    this.sell();
  }
}

function onExit() {
  // Clean up resources
  console.log("Strategy execution completed");
}
`)

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">代码编辑器</TabsTrigger>
            <TabsTrigger value="templates">模板</TabsTrigger>
            <TabsTrigger value="docs">文档</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="relative">
              <textarea
                className="min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="cursor-pointer rounded-md border p-4 hover:bg-accent">
                <h4 className="font-medium">移动平均线交叉</h4>
                <p className="text-sm text-muted-foreground">基于两个移动平均线交叉的策略。</p>
              </div>
              <div className="cursor-pointer rounded-md border p-4 hover:bg-accent">
                <h4 className="font-medium">RSI策略</h4>
                <p className="text-sm text-muted-foreground">使用相对强度指数判断超买/超卖条件的策略。</p>
              </div>
              <div className="cursor-pointer rounded-md border p-4 hover:bg-accent">
                <h4 className="font-medium">布林带</h4>
                <p className="text-sm text-muted-foreground">使用布林带识别波动率和价格水平的策略。</p>
              </div>
              <div className="cursor-pointer rounded-md border p-4 hover:bg-accent">
                <h4 className="font-medium">机器学习模板</h4>
                <p className="text-sm text-muted-foreground">实现基于机器学习的策略的模板。</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <h3>策略API文档</h3>
              <p>您的策略代码应实现以下函数：</p>
              <ul>
                <li>
                  <strong>initialize()</strong> - 策略启动时调用一次。
                </li>
                <li>
                  <strong>onData(data)</strong> - 每个新数据点都会调用。
                </li>
                <li>
                  <strong>onExit()</strong> - 策略执行结束时调用。
                </li>
              </ul>
              <h4>可用方法</h4>
              <ul>
                <li>
                  <code>this.buy()</code> - 开仓做多
                </li>
                <li>
                  <code>this.sell()</code> - 平仓做多或开仓做空
                </li>
                <li>
                  <code>this.position</code> - 当前仓位（正数为多头，负数为空头，0为无仓位）
                </li>
              </ul>
              <h4>指标类</h4>
              <ul>
                <li>
                  <code>MovingAverage(period)</code> - 简单移动平均线
                </li>
                <li>
                  <code>EMA(period)</code> - 指数移动平均线
                </li>
                <li>
                  <code>RSI(period)</code> - 相对强度指数
                </li>
                <li>
                  <code>BollingerBands(period, stdDev)</code> - 布林带
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
