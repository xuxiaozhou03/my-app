"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SignalLegend from "@/components/signal-legend";
import PerformanceMetrics from "@/components/performance-metrics";
import EquityCurveChart from "@/components/equity-curve-chart";
import TradeList from "@/components/trade-list";
import { Loader2 } from "lucide-react";
import KLineChart from "@/components/kline-chart";
import useEtfList from "@/hooks/use-etf-list";
import useBacktest from "@/hooks/use-backtest";

export default function Dashboard() {
  const { selectedETF, loading, etfList, handleETFChange } = useEtfList();

  const [activeTab, setActiveTab] = useState("chart");

  const { initialCapital, signals, backtestResult, total } = useBacktest(
    selectedETF?.symbol
  );

  // const handleRunBacktest = () => {
  //   // Recalculate BOLL indicator with current parameters
  //   const boll = calculateBOLL(klineData);

  //   // Run BOLL strategy
  //   const strategySignals = runBollStrategy(boll);
  //   setSignals(strategySignals);

  //   // Run backtest
  //   const result = backtest(klineData, strategySignals, initialCapital);
  //   setBacktestResult(result);
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        A股ETF量化交易 - BOLL策略可视化
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>ETF选择</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedETF?.symbol}
              onValueChange={handleETFChange}
              disabled={loading || etfList.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择ETF" />
              </SelectTrigger>
              <SelectContent>
                {etfList.map((etf) => (
                  <SelectItem key={etf.symbol} value={etf.symbol}>
                    {etf.name} ({etf.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>初始资金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                disabled={loading}
              />
              <span>元</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>BOLL参数</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="period">周期</Label>
                <Input
                  id="period"
                  type="number"
                  value={bollPeriod}
                  onChange={(e) => setBollPeriod(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="multiplier">倍数</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  value={bollMultiplier}
                  onChange={(e) => setBollMultiplier(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>操作</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              // onClick={handleRunBacktest}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中
                </>
              ) : (
                "运行回测"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedETF && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {selectedETF.name} ({selectedETF.symbol})
            </CardTitle>
            <CardDescription>
              当前价格: {selectedETF.price} 元 | 涨跌幅: {selectedETF.change}%
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart">K线图表</TabsTrigger>
          <TabsTrigger value="performance">策略表现</TabsTrigger>
          <TabsTrigger value="trades">交易记录</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>K线图与BOLL指标</CardTitle>
                <CardDescription>
                  显示K线、布林带上中下轨以及买卖信号
                </CardDescription>
              </CardHeader>
              <CardContent className="box-border">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <KLineChart signals={signals} />
                )}
              </CardContent>
              {signals && signals.length > 0 && (
                <SignalLegend signals={signals} />
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>策略表现指标</CardTitle>
              </CardHeader>
              <CardContent>
                {backtestResult ? (
                  <PerformanceMetrics result={backtestResult} total={total} />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    暂无回测数据
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>资金曲线</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {backtestResult ? (
                  <EquityCurveChart
                    equityCurve={backtestResult.equityCurve}
                    initialCapital={initialCapital}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    暂无回测数据
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>交易记录</CardTitle>
            </CardHeader>
            <CardContent>
              {backtestResult ? (
                <TradeList trades={backtestResult.trades} />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  暂无交易记录
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
