import { type IStrategy, type MarketData, SignalType } from "../strategy/strategy-base"

/**
 * 回测结果接口
 */
export interface BacktestResult {
  // 策略名称
  strategyName: string
  // 初始资金
  initialCapital: number
  // 最终资金
  finalCapital: number
  // 总回报率
  totalReturn: number
  // 年化回报率
  annualReturn: number
  // 夏普比率
  sharpeRatio: number
  // 最大回撤
  maxDrawdown: number
  // 交易次数
  totalTrades: number
  // 盈利交易次数
  winningTrades: number
  // 亏损交易次数
  losingTrades: number
  // 胜率
  winRate: number
  // 盈亏比
  profitFactor: number
  // 每日资金曲线
  equityCurve: { date: Date; equity: number }[]
  // 所有交易记录
  trades: Trade[]
  // 策略参数
  params: Record<string, any>
}

/**
 * 交易记录接口
 */
export interface Trade {
  entryDate: Date
  entryPrice: number
  exitDate: Date | null
  exitPrice: number | null
  shares: number
  side: "LONG" | "SHORT"
  pnl: number
  pnlPercent: number
  status: "OPEN" | "CLOSED"
}

/**
 * 回测配置接口
 */
export interface BacktestConfig {
  // 初始资金
  initialCapital: number
  // 手续费率
  commissionRate: number
  // 滑点
  slippage: number
  // 是否允许做空
  allowShort: boolean
  // 头寸规模 (0-1之间，表示资金比例)
  positionSize: number
}

/**
 * 回测引擎类
 */
export class BacktestEngine {
  private strategy: IStrategy
  private data: MarketData[] = []
  private config: BacktestConfig
  private cash: number
  private position = 0
  private positionValue = 0
  private trades: Trade[] = []
  private currentTrade: Trade | null = null
  private equityCurve: { date: Date; equity: number }[] = []

  constructor(strategy: IStrategy, config: BacktestConfig) {
    this.strategy = strategy
    this.config = config
    this.cash = config.initialCapital
  }

  /**
   * 加载市场数据
   */
  loadData(data: MarketData[]): void {
    this.data = data
  }

  /**
   * 运行回测
   */
  run(): BacktestResult {
    // 初始化策略
    this.strategy.initialize()

    // 初始化回测状态
    this.cash = this.config.initialCapital
    this.position = 0
    this.positionValue = 0
    this.trades = []
    this.currentTrade = null
    this.equityCurve = []

    // 遍历每个数据点
    for (const bar of this.data) {
      // 获取策略信号
      const signal = this.strategy.onData(bar)

      // 处理信号
      if (signal) {
        this.processSignal(signal, bar)
      }

      // 更新权益曲线
      const equity = this.cash + this.positionValue
      this.equityCurve.push({
        date: bar.timestamp,
        equity,
      })
    }

    // 平掉所有未平仓的交易
    if (this.position !== 0 && this.data.length > 0) {
      const lastBar = this.data[this.data.length - 1]
      if (this.position > 0) {
        this.processSignal(SignalType.SELL, lastBar)
      } else if (this.position < 0 && this.config.allowShort) {
        this.processSignal(SignalType.BUY, lastBar)
      }
    }

    // 计算回测结果
    return this.calculateResults()
  }

  /**
   * 处理交易信号
   */
  private processSignal(signal: SignalType, bar: MarketData): void {
    const price = bar.close

    // 根据信号执行交易
    switch (signal) {
      case SignalType.BUY:
        // 如果已经持有多头仓位，不做任何操作
        if (this.position > 0) break

        // 如果持有空头仓位，先平仓
        if (this.position < 0 && this.config.allowShort) {
          this.closePosition(bar)
        }

        // 计算可买入的股数
        const availableCash = this.cash * this.config.positionSize
        const shares = Math.floor(availableCash / (price * (1 + this.config.commissionRate)))

        if (shares > 0) {
          // 更新现金和持仓
          const cost = shares * price * (1 + this.config.commissionRate)
          this.cash -= cost
          this.position = shares
          this.positionValue = shares * price

          // 记录交易
          this.currentTrade = {
            entryDate: bar.timestamp,
            entryPrice: price,
            exitDate: null,
            exitPrice: null,
            shares,
            side: "LONG",
            pnl: 0,
            pnlPercent: 0,
            status: "OPEN",
          }
        }
        break

      case SignalType.SELL:
        // 如果已经持有空头仓位或没有仓位，不做任何操作
        if (this.position <= 0) break

        // 平仓
        this.closePosition(bar)

        // 如果允许做空，建立空头仓位
        if (this.config.allowShort) {
          const availableCash = this.cash * this.config.positionSize
          const shares = Math.floor(availableCash / (price * (1 + this.config.commissionRate)))

          if (shares > 0) {
            // 更新现金和持仓
            const proceeds = shares * price * (1 - this.config.commissionRate)
            this.cash += proceeds
            this.position = -shares
            this.positionValue = shares * price

            // 记录交易
            this.currentTrade = {
              entryDate: bar.timestamp,
              entryPrice: price,
              exitDate: null,
              exitPrice: null,
              shares,
              side: "SHORT",
              pnl: 0,
              pnlPercent: 0,
              status: "OPEN",
            }
          }
        }
        break

      case SignalType.HOLD:
        // 不做任何操作
        break
    }

    // 更新持仓价值
    if (this.position !== 0) {
      this.positionValue = Math.abs(this.position) * price
    }
  }

  /**
   * 平仓
   */
  private closePosition(bar: MarketData): void {
    const price = bar.close

    if (this.position !== 0 && this.currentTrade) {
      // 计算平仓金额
      let proceeds = 0
      let pnl = 0

      if (this.position > 0) {
        // 多头平仓
        proceeds = this.position * price * (1 - this.config.commissionRate)
        pnl = proceeds - this.position * this.currentTrade.entryPrice * (1 + this.config.commissionRate)
      } else if (this.position < 0) {
        // 空头平仓
        proceeds = Math.abs(this.position) * price * (1 + this.config.commissionRate)
        pnl = Math.abs(this.position) * this.currentTrade.entryPrice * (1 - this.config.commissionRate) - proceeds
      }

      // 更新现金和持仓
      this.cash += proceeds

      // 完成交易记录
      this.currentTrade.exitDate = bar.timestamp
      this.currentTrade.exitPrice = price
      this.currentTrade.pnl = pnl
      this.currentTrade.pnlPercent = (pnl / (Math.abs(this.position) * this.currentTrade.entryPrice)) * 100
      this.currentTrade.status = "CLOSED"

      // 添加到交易列表
      this.trades.push({ ...this.currentTrade })

      // 重置当前交易和持仓
      this.currentTrade = null
      this.position = 0
      this.positionValue = 0
    }
  }

  /**
   * 计算回测结果
   */
  private calculateResults(): BacktestResult {
    const initialCapital = this.config.initialCapital
    const finalCapital = this.cash + this.positionValue
    const totalReturn = (finalCapital / initialCapital - 1) * 100

    // 计算年化回报率
    const firstDate = this.data[0]?.timestamp
    const lastDate = this.data[this.data.length - 1]?.timestamp
    let annualReturn = 0

    if (firstDate && lastDate) {
      const years = (lastDate.getTime() - firstDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
      annualReturn = (Math.pow(finalCapital / initialCapital, 1 / years) - 1) * 100
    }

    // 计算最大回撤
    let maxDrawdown = 0
    let peak = initialCapital

    for (const point of this.equityCurve) {
      if (point.equity > peak) {
        peak = point.equity
      }

      const drawdown = ((peak - point.equity) / peak) * 100
      maxDrawdown = Math.max(maxDrawdown, drawdown)
    }

    // 计算交易统计
    const totalTrades = this.trades.length
    const winningTrades = this.trades.filter((t) => t.pnl > 0).length
    const losingTrades = this.trades.filter((t) => t.pnl <= 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // 计算盈亏比
    const totalProfit = this.trades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
    const totalLoss = Math.abs(this.trades.filter((t) => t.pnl <= 0).reduce((sum, t) => sum + t.pnl, 0))
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Number.POSITIVE_INFINITY : 0

    // 计算夏普比率
    let sharpeRatio = 0
    if (this.equityCurve.length > 1) {
      const returns: number[] = []
      for (let i = 1; i < this.equityCurve.length; i++) {
        const dailyReturn = this.equityCurve[i].equity / this.equityCurve[i - 1].equity - 1
        returns.push(dailyReturn)
      }

      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
      const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)

      // 假设无风险利率为0
      sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0 // 252个交易日/年
    }

    return {
      strategyName: this.strategy.name,
      initialCapital,
      finalCapital,
      totalReturn,
      annualReturn,
      sharpeRatio,
      maxDrawdown,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      profitFactor,
      equityCurve: [...this.equityCurve],
      trades: [...this.trades],
      params: { ...this.strategy.params },
    }
  }
}
