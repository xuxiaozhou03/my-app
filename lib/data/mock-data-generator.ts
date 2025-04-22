import type { MarketData } from "../strategy/strategy-base"

/**
 * 模拟数据生成器
 * 用于生成模拟的市场数据，当真实API不可用时使用
 */
export class MockDataGenerator {
  /**
   * 生成模拟的K线数据
   * @param symbol 股票代码
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 模拟的市场数据数组
   */
  static generateKLineData(symbol: string, startDate: Date, endDate: Date): MarketData[] {
    const marketData: MarketData[] = []
    const symbolName = symbol.includes("50")
      ? "50ETF"
      : symbol.includes("300")
        ? "300ETF"
        : symbol.includes("500")
          ? "500ETF"
          : symbol.includes("000001")
            ? "上证指数"
            : "ETF"

    // 设置初始价格和波动范围
    let basePrice = 0
    if (symbol.includes("50")) basePrice = 3.5
    else if (symbol.includes("300")) basePrice = 4.2
    else if (symbol.includes("500")) basePrice = 6.8
    else if (symbol.includes("000001")) basePrice = 3200
    else basePrice = 5.0

    // 生成日期序列
    const dates: Date[] = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      // 跳过周末
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 生成价格序列
    let price = basePrice
    const trend = 0.0005 // 微小的上升趋势
    const volatility = 0.01 // 每日波动率

    for (const date of dates) {
      // 添加随机波动和趋势
      const dailyReturn = trend + (Math.random() - 0.5) * volatility * 2
      price = price * (1 + dailyReturn)

      // 计算当天的开高低收
      const open = price * (1 + (Math.random() - 0.5) * 0.005)
      const close = price
      const high = Math.max(open, close) * (1 + Math.random() * 0.005)
      const low = Math.min(open, close) * (1 - Math.random() * 0.005)
      const volume = Math.floor(Math.random() * 10000000) + 1000000

      marketData.push({
        symbol,
        timestamp: new Date(date),
        open,
        high,
        low,
        close,
        volume,
        name: symbolName,
        source: "模拟数据",
      })
    }

    return marketData
  }
}
