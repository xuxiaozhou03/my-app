import { StrategyBase, type MarketData, SignalType } from "../strategy-base"
import { RSI } from "../../indicators/rsi"

/**
 * RSI策略
 * 当RSI低于超卖水平时买入，高于超买水平时卖出
 */
export class RSIStrategy extends StrategyBase {
  private rsi: RSI
  private values: number[] = []

  constructor(params: {
    period: number
    overbought: number
    oversold: number
  }) {
    super("RSI策略", "基于相对强弱指标(RSI)的均值回归策略", params)

    this.rsi = new RSI(params.period)
  }

  initialize(): void {
    super.initialize()
    this.values = []
  }

  onData(data: MarketData): SignalType | null {
    // 更新RSI
    const value = this.rsi.update(data.close)
    this.values.push(value)

    // 如果没有足够的数据，保持当前状态
    if (this.values.length < 2) {
      return SignalType.HOLD
    }

    // 获取当前RSI值
    const currentRSI = this.values[this.values.length - 1]

    // 检查超买/超卖条件
    if (currentRSI < this.params.oversold) {
      return SignalType.BUY
    }

    if (currentRSI > this.params.overbought) {
      return SignalType.SELL
    }

    // 无信号，保持当前状态
    return SignalType.HOLD
  }
}
