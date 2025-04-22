"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { PlayCircle } from "lucide-react"
import { DataSourceFactory, type DataSourceType } from "@/lib/data/data-source-factory"
import { BacktestService, type StrategyType } from "@/lib/services/backtest-service"
import { useToast } from "@/hooks/use-toast"
import type { DateRange } from "react-day-picker"

interface BacktestingFormProps {
  onBacktestComplete?: () => void
}

export function BacktestingForm({ onBacktestComplete }: BacktestingFormProps) {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [symbols, setSymbols] = useState<{ symbol: string; name: string }[]>([])
  const [indices, setIndices] = useState<{ symbol: string; name: string }[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string>("")
  const [symbolType, setSymbolType] = useState<"etf" | "index">("etf")
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>("eastmoney")
  const [dataSources, setDataSources] = useState<{ value: DataSourceType; label: string }[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 1),
    to: new Date(),
  })
  const [initialCapital, setInitialCapital] = useState<number>(100000)
  const [positionSize, setPositionSize] = useState<number>(100)
  const [useCommission, setUseCommission] = useState<boolean>(true)
  const [commissionRate, setCommissionRate] = useState<number>(0.1)
  const [useSlippage, setUseSlippage] = useState<boolean>(true)
  const [slippage, setSlippage] = useState<number>(0.05)
  const [allowShort, setAllowShort] = useState<boolean>(false)
  const [strategyType, setStrategyType] = useState<StrategyType>("moving-average")

  // 加载数据源列表
  useEffect(() => {
    const dataSourceFactory = DataSourceFactory.getInstance()
    setDataSources(dataSourceFactory.getDataSourceNames())
  }, [])

  // 加载股票和指数列表
  useEffect(() => {
    const loadSymbols = async () => {
      const dataSourceFactory = DataSourceFactory.getInstance()
      const etfList = await dataSourceFactory.getSymbolList(dataSourceType)
      const indexList = await dataSourceFactory.getIndexList(dataSourceType)

      setSymbols(etfList)
      setIndices(indexList)

      // 默认选择第一个ETF
      if (etfList.length > 0 && !selectedSymbol) {
        setSelectedSymbol(etfList[0].symbol)
      }
    }

    loadSymbols()
  }, [dataSourceType, selectedSymbol])

  const runBacktest = async () => {
    if (!selectedSymbol || !dateRange?.from || !dateRange?.to) {
      toast({
        title: "错误",
        description: "请选择交易品种和日期范围",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)

    try {
      const backtestService = BacktestService.getInstance()

      // 准备回测配置
      const backtestConfig = {
        initialCapital,
        commissionRate: useCommission ? commissionRate / 100 : 0,
        slippage: useSlippage ? slippage / 100 : 0,
        allowShort,
        positionSize: positionSize / 100,
      }

      // 准备策略参数
      let strategyParams: Record<string, any> = {}

      switch (strategyType) {
        case "moving-average":
          strategyParams = {
            fastPeriod: 12,
            slowPeriod: 26,
          }
          break
        case "rsi":
          strategyParams = {
            period: 14,
            overbought: 70,
            oversold: 30,
          }
          break
        case "momentum":
          strategyParams = {
            lookbackPeriod: 20,
            threshold: 5,
          }
          break
        case "ml":
          strategyParams = {
            lookback: 10,
            trainPeriod: 50,
            threshold: 0.01,
          }
          break
      }

      // 运行回测
      await backtestService.runBacktest(
        dataSourceType,
        selectedSymbol,
        dateRange.from,
        dateRange.to,
        strategyType,
        strategyParams,
        backtestConfig,
      )

      // 通知回测完成
      if (onBacktestComplete) {
        onBacktestComplete()
      }

      toast({
        title: "回测完成",
        description: "回测已成功完成，请查看结果",
      })
    } catch (error) {
      console.error("回测失败:", error)
      toast({
        title: "回测失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>回测配置</CardTitle>
        <CardDescription>配置您的回测参数</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="data-source">数据源</Label>
          <Select value={dataSourceType} onValueChange={(value) => setDataSourceType(value as DataSourceType)}>
            <SelectTrigger id="data-source">
              <SelectValue placeholder="选择数据源" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="strategy-type">策略类型</Label>
          <Select value={strategyType} onValueChange={(value) => setStrategyType(value as StrategyType)}>
            <SelectTrigger id="strategy-type">
              <SelectValue placeholder="选择策略类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moving-average">移动平均线交叉</SelectItem>
              <SelectItem value="rsi">RSI策略</SelectItem>
              <SelectItem value="momentum">动量策略</SelectItem>
              <SelectItem value="ml">机器学习策略</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol-type">证券类型</Label>
          <Select defaultValue={symbolType} onValueChange={(value) => setSymbolType(value as "etf" | "index")}>
            <SelectTrigger id="symbol-type">
              <SelectValue placeholder="选择证券类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="etf">ETF</SelectItem>
              <SelectItem value="index">指数</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol">交易品种</Label>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger id="symbol">
              <SelectValue placeholder="选择交易品种" />
            </SelectTrigger>
            <SelectContent>
              {symbolType === "etf"
                ? symbols.map((item) => (
                    <SelectItem key={item.symbol} value={item.symbol}>
                      {item.name} ({item.symbol})
                    </SelectItem>
                  ))
                : indices.map((item) => (
                    <SelectItem key={item.symbol} value={item.symbol}>
                      {item.name} ({item.symbol})
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>日期范围</Label>
          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initial-capital">初始资金</Label>
          <Input
            id="initial-capital"
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position-size">头寸规模 (%)</Label>
          <Input
            id="position-size"
            type="number"
            value={positionSize}
            onChange={(e) => setPositionSize(Number(e.target.value))}
            min="1"
            max="100"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="use-commission" checked={useCommission} onCheckedChange={setUseCommission} />
          <Label htmlFor="use-commission">包含佣金</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission-rate">佣金率 (%)</Label>
          <Input
            id="commission-rate"
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            step="0.01"
            min="0"
            disabled={!useCommission}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="use-slippage" checked={useSlippage} onCheckedChange={setUseSlippage} />
          <Label htmlFor="use-slippage">包含滑点</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slippage">滑点 (%)</Label>
          <Input
            id="slippage"
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            step="0.01"
            min="0"
            disabled={!useSlippage}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="allow-short" checked={allowShort} onCheckedChange={setAllowShort} />
          <Label htmlFor="allow-short">允许做空</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={runBacktest} disabled={isRunning || !selectedSymbol}>
          {isRunning ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              正在运行回测...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              运行回测
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
