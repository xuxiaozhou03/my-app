import { StrategyBase, type MarketData, SignalType } from "../strategy-base"

/**
 * 动量策略
 * 基于价格变化率的动量策略
 */
export class MomentumStrategy extends StrategyBase {
  private prices: number[] = []

  constructor(params: {
    lookbackPeriod: number
    threshold: number
  }) {
    super("动量策略", "基于价格变化率的动量交易策略", params)
  }

  initialize(): void {
    super.initialize()
    this.prices = []
  }

  onData(data: MarketData): SignalType | null {
    // 存储价格
    this.prices.push(data.close)

    // 如果没有足够的数据，保持当前状态
    if (this.prices.length <= this.params.lookbackPeriod) {
      return SignalType.HOLD
    }

    // 保持数组长度
    if (this.prices.length > this.params.lookbackPeriod + 1) {
      this.prices.shift()
    }

    // 计算动量 (当前价格与N期前价格的百分比变化)
    const currentPrice = this.prices[this.prices.length - 1]
    const pastPrice = this.prices[0]
    const momentumValue = ((currentPrice - pastPrice) / pastPrice) * 100

    // 基于动量值生成信号
    if (momentumValue > this.params.threshold) {
      return SignalType.BUY
    }

    if (momentumValue < -this.params.threshold) {
      return SignalType.SELL
    }

    // 无信号，保持当前状态
    return SignalType.HOLD
  }
}
