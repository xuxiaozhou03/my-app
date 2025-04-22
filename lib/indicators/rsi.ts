/**
 * 相对强弱指标 (RSI)
 */
export class RSI {
  private period: number
  private gains: number[] = []
  private losses: number[] = []
  private prevValue: number | null = null

  constructor(period: number) {
    this.period = period
  }

  update(value: number): number {
    if (this.prevValue === null) {
      this.prevValue = value
      return 50 // 默认中间值
    }

    // 计算价格变化
    const change = value - this.prevValue
    this.prevValue = value

    // 记录上涨和下跌
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0

    this.gains.push(gain)
    this.losses.push(loss)

    // 保持数组长度
    if (this.gains.length > this.period) {
      this.gains.shift()
      this.losses.shift()
    }

    // 如果没有足够的数据，返回默认值
    if (this.gains.length < this.period) {
      return 50
    }

    // 计算平均上涨和下跌
    const avgGain = this.gains.reduce((sum, val) => sum + val, 0) / this.period
    const avgLoss = this.losses.reduce((sum, val) => sum + val, 0) / this.period

    // 避免除以零
    if (avgLoss === 0) {
      return 100
    }

    // 计算相对强度
    const rs = avgGain / avgLoss

    // 计算RSI
    return 100 - 100 / (1 + rs)
  }

  getValue(): number {
    if (this.gains.length < this.period) return 50

    const avgGain = this.gains.reduce((sum, val) => sum + val, 0) / this.period
    const avgLoss = this.losses.reduce((sum, val) => sum + val, 0) / this.period

    if (avgLoss === 0) return 100

    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  reset(): void {
    this.gains = []
    this.losses = []
    this.prevValue = null
  }
}
