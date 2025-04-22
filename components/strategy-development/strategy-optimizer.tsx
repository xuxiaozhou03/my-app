"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { PlayCircle, Plus, Trash2 } from "lucide-react"
import { DataSourceFactory, type DataSourceType } from "@/lib/data/data-source-factory"

interface StrategyOptimizerProps {
  strategyCode: string
}

export function StrategyOptimizer({ strategyCode }: StrategyOptimizerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [optimizationMethod, setOptimizationMethod] = useState("grid")
  const [parameters, setParameters] = useState([
    { id: 1, name: "fastPeriod", min: 5, max: 20, step: 1 },
    { id: 2, name: "slowPeriod", min: 20, max: 50, step: 5 },
  ])
  const [symbols, setSymbols] = useState<{ symbol: string; name: string }[]>([])
  const [indices, setIndices] = useState<{ symbol: string; name: string }[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string>("")
  const [symbolType, setSymbolType] = useState<"etf" | "index">("etf")
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>("eastmoney")
  const [dataSources, setDataSources] = useState<{ value: DataSourceType; label: string }[]>([])

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
      if (etfList.length > 0) {
        setSelectedSymbol(etfList[0].symbol)
      }
    }

    loadSymbols()
  }, [dataSourceType])

  const addParameter = () => {
    const newId = parameters.length > 0 ? Math.max(...parameters.map((p) => p.id)) + 1 : 1
    setParameters([...parameters, { id: newId, name: "newParam", min: 1, max: 10, step: 1 }])
  }

  const removeParameter = (id: number) => {
    setParameters(parameters.filter((p) => p.id !== id))
  }

  const updateParameter = (id: number, field: string, value: any) => {
    setParameters(parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const runOptimization = () => {
    setIsRunning(true)
    // 模拟优化运行
    setTimeout(() => {
      setIsRunning(false)
      setHasResults(true)
    }, 3000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>参数优化</CardTitle>
          <CardDescription>优化您的策略参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="optimization-method">优化方法</Label>
            <Select defaultValue={optimizationMethod} onValueChange={setOptimizationMethod}>
              <SelectTrigger id="optimization-method">
                <SelectValue placeholder="选择优化方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格搜索</SelectItem>
                <SelectItem value="genetic">遗传算法</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="optimization-metric">优化指标</Label>
            <Select defaultValue="sharpeRatio">
              <SelectTrigger id="optimization-metric">
                <SelectValue placeholder="选择优化指标" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalReturn">总回报</SelectItem>
                <SelectItem value="sharpeRatio">夏普比率</SelectItem>
                <SelectItem value="maxDrawdown">最大回撤</SelectItem>
                <SelectItem value="winRate">胜率</SelectItem>
                <SelectItem value="profitFactor">盈亏比</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>参数范围</Label>
              <Button variant="outline" size="sm" onClick={addParameter}>
                <Plus className="mr-2 h-4 w-4" />
                添加参数
              </Button>
            </div>

            <div className="space-y-4">
              {parameters.map((param) => (
                <div key={param.id} className="grid gap-4 border p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`param-name-${param.id}`}>参数名称</Label>
                      <Input
                        id={`param-name-${param.id}`}
                        value={param.name}
                        onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParameter(param.id)}
                        className="text-red-500 hover:text-red-600 ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`param-min-${param.id}`}>最小值</Label>
                      <Input
                        id={`param-min-${param.id}`}
                        type="number"
                        value={param.min}
                        onChange={(e) => updateParameter(param.id, "min", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`param-max-${param.id}`}>最大值</Label>
                      <Input
                        id={`param-max-${param.id}`}
                        type="number"
                        value={param.max}
                        onChange={(e) => updateParameter(param.id, "max", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`param-step-${param.id}`}>步长</Label>
                      <Input
                        id={`param-step-${param.id}`}
                        type="number"
                        value={param.step}
                        onChange={(e) => updateParameter(param.id, "step", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {parameters.length === 0 && (
                <div className="flex items-center justify-center h-32 border rounded-md">
                  <p className="text-muted-foreground">未定义参数。点击"添加参数"创建一个。</p>
                </div>
              )}
            </div>
          </div>

          {optimizationMethod === "genetic" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="population-size">种群大小</Label>
                <Input id="population-size" type="number" defaultValue="20" min="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="generations">迭代次数</Label>
                <Input id="generations" type="number" defaultValue="10" min="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mutation-rate">变异率 (%)</Label>
                <Input id="mutation-rate" type="number" defaultValue="10" min="1" max="100" />
              </div>
            </>
          )}

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
            <DatePickerWithRange />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={runOptimization}
            disabled={isRunning || !strategyCode || parameters.length === 0 || !selectedSymbol}
          >
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
                正在运行优化...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                运行优化
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {hasResults ? (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>优化结果</CardTitle>
            <CardDescription>最佳参数组合</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-3 border-b bg-muted/50 p-3">
                <div className="font-medium">参数</div>
                <div className="font-medium">最佳值</div>
                <div className="font-medium">性能</div>
              </div>
              <div className="divide-y">
                {parameters.map((param) => (
                  <div key={param.id} className="grid grid-cols-3 p-3">
                    <div className="text-sm">{param.name}</div>
                    <div className="text-sm font-medium">
                      {param.min + Math.floor((param.max - param.min) / param.step / 2) * param.step}
                    </div>
                    <div className="text-sm text-green-600">+{(Math.random() * 10 + 10).toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium mb-2">优化指标</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">夏普比率</p>
                  <p className="text-lg font-bold">{(Math.random() * 1 + 1.5).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">总回报</p>
                  <p className="text-lg font-bold text-green-600">+{(Math.random() * 30 + 40).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">最大回撤</p>
                  <p className="text-lg font-bold text-red-600">-{(Math.random() * 10 + 5).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">胜率</p>
                  <p className="text-lg font-bold">{(Math.random() * 20 + 60).toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium mb-2">参数敏感性分析</h3>
              <p className="text-xs text-muted-foreground mb-4">参数对策略性能的影响程度</p>

              {parameters.map((param) => (
                <div key={param.id} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{param.name}</span>
                    <span className="text-sm">{(Math.random() * 50 + 50).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${Math.random() * 50 + 50}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">应用最佳参数</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="col-span-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">尚无优化结果</h3>
            <p className="text-muted-foreground">配置参数并运行优化以查看结果</p>
          </div>
        </Card>
      )}
    </div>
  )
}
