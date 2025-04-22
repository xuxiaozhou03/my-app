/**
 * 简单移动平均线 (SMA)
 */
export class SMA {
  private period: number
  private values: number[] = []

  constructor(period: number) {
    this.period = period
  }

  update(value: number): number {
    // 添加新值
    this.values.push(value)

    // 保持数组长度不超过周期
    if (this.values.length > this.period) {
      this.values.shift()
    }

    // 计算平均值
    const sum = this.values.reduce((acc, val) => acc + val, 0)
    return sum / this.values.length
  }

  getValue(): number {
    if (this.values.length === 0) return 0
    const sum = this.values.reduce((acc, val) => acc + val, 0)
    return sum / this.values.length
  }

  reset(): void {
    this.values = []
  }
}

/**
 * 指数移动平均线 (EMA)
 */
export class EMA {
  private period: number
  private alpha: number
  private current: number | null = null

  constructor(period: number) {
    this.period = period
    // 平滑因子
    this.alpha = 2 / (period + 1)
  }

  update(value: number): number {
    if (this.current === null) {
      this.current = value
    } else {
      this.current = this.alpha * value + (1 - this.alpha) * this.current
    }
    return this.current
  }

  getValue(): number {
    return this.current || 0
  }

  reset(): void {
    this.current = null
  }
}
