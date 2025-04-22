import { StrategyBase, type MarketData, SignalType } from "../strategy-base"
import { SMA } from "../../indicators/moving-average"

/**
 * 移动平均线交叉策略
 * 当快速移动平均线上穿慢速移动平均线时买入，下穿时卖出
 */
export class MovingAverageStrategy extends StrategyBase {
  private fastMA: SMA
  private slowMA: SMA
  private fastValues: number[] = []
  private slowValues: number[] = []

  constructor(params: {
    fastPeriod: number
    slowPeriod: number
  }) {
    super("移动平均线交叉策略", "基于快速和慢速移动平均线交叉的经典趋势跟踪策略", params)

    this.fastMA = new SMA(params.fastPeriod)
    this.slowMA = new SMA(params.slowPeriod)
  }

  initialize(): void {
    super.initialize()
    this.fastValues = []
    this.slowValues = []
  }

  onData(data: MarketData): SignalType | null {
    // 更新移动平均线
    const fastValue = this.fastMA.update(data.close)
    const slowValue = this.slowMA.update(data.close)

    // 存储值以便后续分析
    this.fastValues.push(fastValue)
    this.slowValues.push(slowValue)

    // 如果没有足够的数据，保持当前状态
    if (this.fastValues.length < 2 || this.slowValues.length < 2) {
      return SignalType.HOLD
    }

    // 获取当前和前一个值
    const currentFast = this.fastValues[this.fastValues.length - 1]
    const previousFast = this.fastValues[this.fastValues.length - 2]
    const currentSlow = this.slowValues[this.slowValues.length - 1]
    const previousSlow = this.slowValues[this.slowValues.length - 2]

    // 检查交叉
    // 快线从下方穿过慢线 (买入信号)
    if (previousFast < previousSlow && currentFast > currentSlow) {
      return SignalType.BUY
    }

    // 快线从上方穿过慢线 (卖出信号)
    if (previousFast > previousSlow && currentFast < currentSlow) {
      return SignalType.SELL
    }

    // 无交叉，保持当前状态
    return SignalType.HOLD
  }
}
