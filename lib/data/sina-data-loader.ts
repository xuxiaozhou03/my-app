import type { MarketData } from "../strategy/strategy-base"
import { MockDataGenerator } from "./mock-data-generator"

/**
 * 新浪财经数据加载器
 * 从新浪财经网站API获取K线数据
 */
export class SinaDataLoader {
  /**
   * 加载K线数据
   * @param symbol 股票代码（格式：sh000001、sz399001等）
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 市场数据数组
   */
  async loadData(symbol: string, startDate: Date, endDate: Date): Promise<MarketData[]> {
    try {
      // 格式化日期为YYYY-MM-DD格式
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)

      // 构建API URL
      const url = `https://quotes.sina.cn/cn/api/jsonp_v2.php/var%20_${symbol}_day_data=${startDateStr}_{endDateStr}/CN_MarketDataService.getKLineData?symbol=${symbol}&scale=240&ma=no&datalen=1023`

      // 发起请求
      const response = await fetch(url)

      // 新浪返回的是JSONP格式，需要处理
      const text = await response.text()
      const jsonStr = text.replace(/var\s+_.*_day_data=/, "").replace(/;$/, "")

      let data
      try {
        data = JSON.parse(jsonStr)
      } catch (e) {
        console.warn("解析新浪K线数据失败，使用模拟数据", e)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      // 检查是否成功获取数据
      if (!data || data.length === 0) {
        console.warn("未能获取到新浪K线数据，使用模拟数据", data)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      // 解析K线数据
      // 新浪K线格式：{day: "2023-04-20", open: "3.353", high: "3.360", low: "3.321", close: "3.326", volume: "249120"}
      const marketData: MarketData[] = data.map((item: any) => {
        // 解析日期 (格式: YYYY-MM-DD)
        const date = new Date(item.day)

        return {
          symbol: symbol,
          timestamp: date,
          open: Number.parseFloat(item.open),
          high: Number.parseFloat(item.high),
          low: Number.parseFloat(item.low),
          close: Number.parseFloat(item.close),
          volume: Number.parseFloat(item.volume),
          name: symbol,
          source: "新浪财经",
        }
      })

      return marketData
    } catch (error) {
      console.error("获取新浪K线数据失败，使用模拟数据:", error)
      return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
    }
  }

  /**
   * 获取股票代码列表
   * @returns 股票代码和名称列表
   */
  async getSymbolList(): Promise<{ symbol: string; name: string }[]> {
    try {
      // 这里简化处理，返回一些常用的ETF
      return [
        { symbol: "sh510050", name: "50ETF" },
        { symbol: "sh510300", name: "300ETF" },
        { symbol: "sh510500", name: "500ETF" },
        { symbol: "sh512880", name: "证券ETF" },
        { symbol: "sh512690", name: "酒ETF" },
        { symbol: "sh512170", name: "医疗ETF" },
        { symbol: "sh512760", name: "芯片ETF" },
        { symbol: "sh512480", name: "半导体ETF" },
        { symbol: "sh512980", name: "传媒ETF" },
        { symbol: "sh512800", name: "银行ETF" },
        { symbol: "sh512200", name: "地产ETF" },
        { symbol: "sh512660", name: "军工ETF" },
      ]
    } catch (error) {
      console.error("获取新浪股票列表失败:", error)
      return []
    }
  }

  /**
   * 获取指数列表
   * @returns 指数代码和名称列表
   */
  async getIndexList(): Promise<{ symbol: string; name: string }[]> {
    return [
      { symbol: "sh000001", name: "上证指数" },
      { symbol: "sh000300", name: "沪深300" },
      { symbol: "sh000905", name: "中证500" },
      { symbol: "sh000016", name: "上证50" },
      { symbol: "sz399001", name: "深证成指" },
      { symbol: "sz399006", name: "创业板指" },
      { symbol: "sh000688", name: "科创50" },
    ]
  }
}
