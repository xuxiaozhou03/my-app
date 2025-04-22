import { BacktestEngine, type BacktestConfig, type BacktestResult } from "../backtest/backtest-engine"
import { DataSourceFactory, type DataSourceType } from "../data/data-source-factory"
import { MovingAverageStrategy } from "../strategy/strategies/moving-average-strategy"
import { RSIStrategy } from "../strategy/strategies/rsi-strategy"
import { MomentumStrategy } from "../strategy/strategies/momentum-strategy"
import { MLStrategy } from "../strategy/strategies/ml-strategy"
import type { IStrategy } from "../strategy/strategy-base"

export type StrategyType = "moving-average" | "rsi" | "momentum" | "ml" | "custom"

/**
 * 回测服务
 * 连接数据源、策略和回测引擎
 */
export class BacktestService {
  private static instance: BacktestService
  private dataSourceFactory: DataSourceFactory
  private lastResult: BacktestResult | null = null

  private constructor() {
    this.dataSourceFactory = DataSourceFactory.getInstance()
  }

  /**
   * 获取服务实例（单例模式）
   */
  public static getInstance(): BacktestService {
    if (!BacktestService.instance) {
      BacktestService.instance = new BacktestService()
    }
    return BacktestService.instance
  }

  /**
   * 获取最后一次回测结果
   */
  public getLastResult(): BacktestResult | null {
    return this.lastResult
  }

  /**
   * 创建策略实例
   */
  private createStrategy(strategyType: StrategyType, params: Record<string, any>, customCode?: string): IStrategy {
    try {
      switch (strategyType) {
        case "moving-average":
          return new MovingAverageStrategy({
            fastPeriod: params.fastPeriod || 12,
            slowPeriod: params.slowPeriod || 26,
          })
        case "rsi":
          return new RSIStrategy({
            period: params.period || 14,
            overbought: params.overbought || 70,
            oversold: params.oversold || 30,
          })
        case "momentum":
          return new MomentumStrategy({
            lookbackPeriod: params.lookbackPeriod || 20,
            threshold: params.threshold || 5,
          })
        case "ml":
          return new MLStrategy({
            lookback: params.lookback || 10,
            trainPeriod: params.trainPeriod || 50,
            threshold: params.threshold || 0.01,
          })
        case "custom":
          if (!customCode) {
            throw new Error("Custom strategy requires code")
          }
          // 简单实现，实际应该使用更安全的方式执行自定义代码
          try {
            // eslint-disable-next-line no-eval
            const strategyFactory = new Function(customCode)
            return strategyFactory()
          } catch (error) {
            console.error("Error creating custom strategy:", error)
            throw new Error("Invalid custom strategy code")
          }
        default:
          throw new Error(`Unknown strategy type: ${strategyType}`)
      }
    } catch (error) {
      console.error("Error creating strategy:", error)
      throw error
    }
  }

  /**
   * 运行回测
   */
  public async runBacktest(
    dataSourceType: DataSourceType,
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategyType: StrategyType,
    strategyParams: Record<string, any>,
    backtestConfig: BacktestConfig,
    customCode?: string,
  ): Promise<BacktestResult> {
    try {
      // 获取数据
      const data = await this.dataSourceFactory.loadData(dataSourceType, symbol, startDate, endDate)

      if (!data || data.length === 0) {
        throw new Error("No data available for the selected period")
      }

      // 创建策略
      const strategy = this.createStrategy(strategyType, strategyParams, customCode)

      // 创建回测引擎
      const engine = new BacktestEngine(strategy, backtestConfig)
      engine.loadData(data)

      // 运行回测
      const result = engine.run()

      // 保存结果
      this.lastResult = result

      return result
    } catch (error) {
      console.error("Backtest error:", error)
      throw error
    }
  }

  /**
   * 解析策略代码，提取策略类型和参数
   */
  public parseStrategyCode(code: string): { type: StrategyType; params: Record<string, any> } {
    // 简单实现，实际应该使用更复杂的解析方法
    if (code.includes("MovingAverageStrategy")) {
      const fastPeriodMatch = code.match(/fastPeriod:\s*(\d+)/)
      const slowPeriodMatch = code.match(/slowPeriod:\s*(\d+)/)

      return {
        type: "moving-average",
        params: {
          fastPeriod: fastPeriodMatch ? Number.parseInt(fastPeriodMatch[1]) : 12,
          slowPeriod: slowPeriodMatch ? Number.parseInt(slowPeriodMatch[1]) : 26,
        },
      }
    } else if (code.includes("RSIStrategy")) {
      const periodMatch = code.match(/period:\s*(\d+)/)
      const overboughtMatch = code.match(/overbought:\s*(\d+)/)
      const oversoldMatch = code.match(/oversold:\s*(\d+)/)

      return {
        type: "rsi",
        params: {
          period: periodMatch ? Number.parseInt(periodMatch[1]) : 14,
          overbought: overboughtMatch ? Number.parseInt(overboughtMatch[1]) : 70,
          oversold: oversoldMatch ? Number.parseInt(oversoldMatch[1]) : 30,
        },
      }
    } else if (code.includes("MomentumStrategy")) {
      const lookbackPeriodMatch = code.match(/lookbackPeriod:\s*(\d+)/)
      const thresholdMatch = code.match(/threshold:\s*(\d+)/)

      return {
        type: "momentum",
        params: {
          lookbackPeriod: lookbackPeriodMatch ? Number.parseInt(lookbackPeriodMatch[1]) : 20,
          threshold: thresholdMatch ? Number.parseInt(thresholdMatch[1]) : 5,
        },
      }
    } else if (code.includes("MLStrategy")) {
      const lookbackMatch = code.match(/lookback:\s*(\d+)/)
      const trainPeriodMatch = code.match(/trainPeriod:\s*(\d+)/)
      const thresholdMatch = code.match(/threshold:\s*([\d.]+)/)

      return {
        type: "ml",
        params: {
          lookback: lookbackMatch ? Number.parseInt(lookbackMatch[1]) : 10,
          trainPeriod: trainPeriodMatch ? Number.parseInt(trainPeriodMatch[1]) : 50,
          threshold: thresholdMatch ? Number.parseFloat(thresholdMatch[1]) : 0.01,
        },
      }
    } else {
      return {
        type: "custom",
        params: {},
      }
    }
  }
}
