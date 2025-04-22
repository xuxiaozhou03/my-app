import { StrategyBase, type MarketData, SignalType } from "../strategy-base"

/**
 * 简单线性回归模型
 */
class LinearRegression {
  private weights: number[] = []
  private bias = 0
  private learningRate: number
  private features: number

  constructor(features: number, learningRate = 0.01) {
    this.features = features
    this.learningRate = learningRate
    this.weights = Array(features).fill(0)
  }

  // 预测函数
  predict(x: number[]): number {
    if (x.length !== this.features) {
      throw new Error(`特征数量不匹配: 期望 ${this.features}, 实际 ${x.length}`)
    }

    let sum = this.bias
    for (let i = 0; i < this.features; i++) {
      sum += this.weights[i] * x[i]
    }

    return sum
  }

  // 训练函数
  train(x: number[][], y: number[], epochs: number): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < x.length; i++) {
        const features = x[i]
        const target = y[i]

        // 预测
        const prediction = this.predict(features)

        // 计算误差
        const error = prediction - target

        // 更新偏置
        this.bias -= this.learningRate * error

        // 更新权重
        for (let j = 0; j < this.features; j++) {
          this.weights[j] -= this.learningRate * error * features[j]
        }
      }
    }
  }
}

/**
 * 机器学习策略
 * 使用简单线性回归预测价格变动
 */
export class MLStrategy extends StrategyBase {
  private model: LinearRegression
  private lookback: number
  private trainPeriod: number
  private features: number[][]
  private targets: number[]
  private prices: number[]
  private trained = false

  constructor(params: {
    lookback: number
    trainPeriod: number
    threshold: number
  }) {
    super("机器学习策略", "使用简单线性回归预测价格变动的机器学习策略", params)

    this.lookback = params.lookback
    this.trainPeriod = params.trainPeriod
    this.model = new LinearRegression(this.lookback)
    this.features = []
    this.targets = []
    this.prices = []
  }

  initialize(): void {
    super.initialize()
    this.features = []
    this.targets = []
    this.prices = []
    this.trained = false
  }

  onData(data: MarketData): SignalType | null {
    // 存储价格
    this.prices.push(data.close)

    // 如果没有足够的数据，保持当前状态
    if (this.prices.length <= this.lookback + 1) {
      return SignalType.HOLD
    }

    // 准备特征和目标
    const feature = this.prices.slice(-this.lookback - 1, -1).map(
      (price, i, arr) => price / arr[0] - 1, // 归一化
    )
    const target = this.prices[this.prices.length - 1] / this.prices[this.prices.length - 2] - 1

    this.features.push(feature)
    this.targets.push(target)

    // 如果收集了足够的训练数据，训练模型
    if (!this.trained && this.features.length >= this.trainPeriod) {
      this.model.train(this.features, this.targets, 100)
      this.trained = true
    }

    // 如果模型已训练，使用它来预测
    if (this.trained) {
      const prediction = this.model.predict(feature)

      // 基于预测生成信号
      if (prediction > this.params.threshold) {
        return SignalType.BUY
      } else if (prediction < -this.params.threshold) {
        return SignalType.SELL
      }
    }

    return SignalType.HOLD
  }
}
