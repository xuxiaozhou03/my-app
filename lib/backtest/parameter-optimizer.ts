import type { IStrategy, MarketData } from "../strategy/strategy-base"
import { BacktestEngine, type BacktestConfig, type BacktestResult } from "./backtest-engine"

/**
 * 参数范围接口
 */
export interface ParameterRange {
  name: string
  min: number
  max: number
  step: number
}

/**
 * 优化结果接口
 */
export interface OptimizationResult {
  bestParams: Record<string, any>
  bestResult: BacktestResult
  allResults: Array<{
    params: Record<string, any>
    result: BacktestResult
  }>
}

/**
 * 参数优化器类
 */
export class ParameterOptimizer {
  private strategyFactory: (params: Record<string, any>) => IStrategy
  private data: MarketData[]
  private backtestConfig: BacktestConfig
  private paramRanges: ParameterRange[]
  private optimizationMetric: keyof BacktestResult
  private maximizeMetric: boolean

  constructor(
    strategyFactory: (params: Record<string, any>) => IStrategy,
    data: MarketData[],
    backtestConfig: BacktestConfig,
    paramRanges: ParameterRange[],
    optimizationMetric: keyof BacktestResult = "sharpeRatio",
    maximizeMetric = true,
  ) {
    this.strategyFactory = strategyFactory
    this.data = data
    this.backtestConfig = backtestConfig
    this.paramRanges = paramRanges
    this.optimizationMetric = optimizationMetric
    this.maximizeMetric = maximizeMetric
  }

  /**
   * 执行网格搜索优化
   */
  gridSearch(): OptimizationResult {
    const paramCombinations = this.generateParameterCombinations()
    const results: Array<{
      params: Record<string, any>
      result: BacktestResult
    }> = []

    let bestResult: BacktestResult | null = null
    let bestParams: Record<string, any> = {}

    // 遍历所有参数组合
    for (const params of paramCombinations) {
      // 创建策略实例
      const strategy = this.strategyFactory(params)

      // 创建回测引擎
      const engine = new BacktestEngine(strategy, this.backtestConfig)
      engine.loadData(this.data)

      // 运行回测
      const result = engine.run()

      // 保存结果
      results.push({
        params,
        result,
      })

      // 更新最佳结果
      if (!bestResult || this.isBetterResult(result, bestResult)) {
        bestResult = result
        bestParams = { ...params }
      }
    }

    return {
      bestParams,
      bestResult: bestResult!,
      allResults: results,
    }
  }

  /**
   * 生成所有参数组合
   */
  private generateParameterCombinations(): Array<Record<string, any>> {
    const combinations: Array<Record<string, any>> = [{}]

    for (const range of this.paramRanges) {
      const newCombinations: Array<Record<string, any>> = []

      for (const combo of combinations) {
        for (let value = range.min; value <= range.max; value += range.step) {
          newCombinations.push({
            ...combo,
            [range.name]: value,
          })
        }
      }

      combinations.length = 0
      combinations.push(...newCombinations)
    }

    return combinations
  }

  /**
   * 比较两个回测结果
   */
  private isBetterResult(current: BacktestResult, best: BacktestResult): boolean {
    const currentValue = current[this.optimizationMetric] as number
    const bestValue = best[this.optimizationMetric] as number

    return this.maximizeMetric ? currentValue > bestValue : currentValue < bestValue
  }

  /**
   * 执行遗传算法优化
   * 注意：这是一个简化版的遗传算法实现
   */
  geneticAlgorithm(populationSize = 20, generations = 10, mutationRate = 0.1, eliteCount = 2): OptimizationResult {
    // 初始化种群
    let population = this.initializePopulation(populationSize)
    const results: Array<{
      params: Record<string, any>
      result: BacktestResult
    }> = []

    // 评估初始种群
    let evaluatedPopulation = this.evaluatePopulation(population)
    results.push(...evaluatedPopulation)

    // 迭代进化
    for (let gen = 0; gen < generations; gen++) {
      // 选择精英
      const elites = [...evaluatedPopulation]
        .sort((a, b) => {
          const aValue = a.result[this.optimizationMetric] as number
          const bValue = b.result[this.optimizationMetric] as number
          return this.maximizeMetric ? bValue - aValue : aValue - bValue
        })
        .slice(0, eliteCount)
        .map((item) => item.params)

      // 创建新种群
      const newPopulation: Array<Record<string, any>> = [...elites]

      // 通过交叉和变异生成新个体
      while (newPopulation.length < populationSize) {
        // 选择父代
        const parent1 = this.selectParent(evaluatedPopulation)
        const parent2 = this.selectParent(evaluatedPopulation)

        // 交叉
        const child = this.crossover(parent1, parent2)

        // 变异
        this.mutate(child, mutationRate)

        // 添加到新种群
        newPopulation.push(child)
      }

      // 评估新种群
      population = newPopulation
      const newEvaluated = this.evaluatePopulation(population)
      evaluatedPopulation = newEvaluated
      results.push(...newEvaluated)
    }

    // 找出最佳结果
    const bestItem = results.reduce((best, current) => {
      const currentValue = current.result[this.optimizationMetric] as number
      const bestValue = best.result[this.optimizationMetric] as number
      return this.maximizeMetric
        ? currentValue > bestValue
          ? current
          : best
        : currentValue < bestValue
          ? current
          : best
    }, results[0])

    return {
      bestParams: bestItem.params,
      bestResult: bestItem.result,
      allResults: results,
    }
  }

  /**
   * 初始化种群
   */
  private initializePopulation(size: number): Array<Record<string, any>> {
    const population: Array<Record<string, any>> = []

    for (let i = 0; i < size; i++) {
      const individual: Record<string, any> = {}

      for (const range of this.paramRanges) {
        // 在参数范围内随机生成值
        const steps = Math.floor((range.max - range.min) / range.step) + 1
        const randomStep = Math.floor(Math.random() * steps)
        individual[range.name] = range.min + randomStep * range.step
      }

      population.push(individual)
    }

    return population
  }

  /**
   * 评估种群
   */
  private evaluatePopulation(population: Array<Record<string, any>>): Array<{
    params: Record<string, any>
    result: BacktestResult
  }> {
    return population.map((params) => {
      const strategy = this.strategyFactory(params)
      const engine = new BacktestEngine(strategy, this.backtestConfig)
      engine.loadData(this.data)
      const result = engine.run()

      return {
        params,
        result,
      }
    })
  }

  /**
   * 选择父代
   * 使用轮盘赌选择法
   */
  private selectParent(
    population: Array<{
      params: Record<string, any>
      result: BacktestResult
    }>,
  ): Record<string, any> {
    // 计算适应度
    const fitnessValues = population.map((item) => {
      const value = item.result[this.optimizationMetric] as number
      // 确保适应度为正数
      return this.maximizeMetric ? Math.max(0, value) : Math.max(0, 1 / (value + 0.0001))
    })

    // 计算总适应度
    const totalFitness = fitnessValues.reduce((sum, val) => sum + val, 0)

    if (totalFitness === 0) {
      // 如果总适应度为0，随机选择
      const randomIndex = Math.floor(Math.random() * population.length)
      return { ...population[randomIndex].params }
    }

    // 轮盘赌选择
    const randomValue = Math.random() * totalFitness
    let cumulativeFitness = 0

    for (let i = 0; i < population.length; i++) {
      cumulativeFitness += fitnessValues[i]
      if (cumulativeFitness >= randomValue) {
        return { ...population[i].params }
      }
    }

    // 默认返回最后一个
    return { ...population[population.length - 1].params }
  }

  /**
   * 交叉操作
   * 使用均匀交叉
   */
  private crossover(parent1: Record<string, any>, parent2: Record<string, any>): Record<string, any> {
    const child: Record<string, any> = {}

    for (const range of this.paramRanges) {
      // 50%的概率从每个父代继承
      child[range.name] = Math.random() < 0.5 ? parent1[range.name] : parent2[range.name]
    }

    return child
  }

  /**
   * 变异操作
   */
  private mutate(individual: Record<string, any>, rate: number): void {
    for (const range of this.paramRanges) {
      // 以一定概率进行变异
      if (Math.random() < rate) {
        const steps = Math.floor((range.max - range.min) / range.step) + 1
        const randomStep = Math.floor(Math.random() * steps)
        individual[range.name] = range.min + randomStep * range.step
      }
    }
  }
}
