/**
 * 策略基础接口
 * 定义了所有交易策略必须实现的方法
 */
export interface IStrategy {
  // 策略名称
  name: string
  // 策略描述
  description: string
  // 策略参数
  params: Record<string, any>

  // 初始化策略
  initialize(): void
  // 处理新数据
  onData(data: MarketData): SignalType | null
  // 策略退出时调用
  onExit(): void
}

/**
 * 市场数据接口
 */
export interface MarketData {
  symbol: string
  timestamp: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
  // 可选的附加数据
  [key: string]: any
}

/**
 * 交易信号类型
 */
export enum SignalType {
  BUY = "BUY",
  SELL = "SELL",
  HOLD = "HOLD",
}

/**
 * 交易订单接口
 */
export interface Order {
  symbol: string
  type: "MARKET" | "LIMIT"
  side: "BUY" | "SELL"
  quantity: number
  price?: number
  timestamp: Date
}

/**
 * 策略基类
 * 提供了策略的基本实现，用户可以继承此类来创建自定义策略
 */
export abstract class StrategyBase implements IStrategy {
  name: string
  description: string
  params: Record<string, any>
  position = 0 // 当前持仓数量

  constructor(name: string, description: string, params: Record<string, any>) {
    this.name = name
    this.description = description
    this.params = params
  }

  // 初始化策略，子类应重写此方法
  initialize(): void {
    console.log(`初始化策略: ${this.name}`)
  }

  // 处理新数据，子类必须重写此方法
  abstract onData(data: MarketData): SignalType | null

  // 策略退出时调用，子类可重写此方法
  onExit(): void {
    console.log(`策略退出: ${this.name}`)
  }

  // 创建买入订单
  createBuyOrder(symbol: string, quantity: number, price?: number): Order {
    return {
      symbol,
      type: price ? "LIMIT" : "MARKET",
      side: "BUY",
      quantity,
      price,
      timestamp: new Date(),
    }
  }

  // 创建卖出订单
  createSellOrder(symbol: string, quantity: number, price?: number): Order {
    return {
      symbol,
      type: price ? "LIMIT" : "MARKET",
      side: "SELL",
      quantity,
      quantity,
      price,
      timestamp: new Date(),
    }
  }
}
