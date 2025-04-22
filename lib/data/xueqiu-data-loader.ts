import type { MarketData } from "../strategy/strategy-base"
import { MockDataGenerator } from "./mock-data-generator"

/**
 * 雪球数据加载器
 * 从雪球网站API获取K线数据
 */
export class XueQiuDataLoader {
  /**
   * 加载K线数据
   * @param symbol 股票代码（格式：SH000001、SZ399001等）
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 市场数据数组
   */
  async loadData(symbol: string, startDate: Date, endDate: Date): Promise<MarketData[]> {
    try {
      // 将东方财富格式转换为雪球格式
      const xueqiuSymbol = symbol.toUpperCase()

      // 转换为时间戳
      const startTimestamp = Math.floor(startDate.getTime() / 1000)
      const endTimestamp = Math.floor(endDate.getTime() / 1000)

      // 构建API URL (注意：实际使用时需要处理雪球的登录和cookie问题)
      const url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${xueqiuSymbol}&begin=${startTimestamp}000&period=day&type=before&count=-284&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`

      // 发起请求
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Referer: "https://xueqiu.com/",
        },
      })

      const data = await response.json()

      // 检查是否成功获取数据
      if (!data.data || !data.data.item || data.data.item.length === 0) {
        console.warn("未能获取到雪球K线数据，使用模拟数据", data)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      // 解析K线数据
      // 雪球K线格式：[时间戳, 开盘价, 收盘价, 最高价, 最低价, 成交量, 成交额, ...]
      const marketData: MarketData[] = data.data.item.map((item: number[]) => {
        const timestamp = new Date(item[0])

        return {
          symbol: symbol,
          timestamp: timestamp,
          open: item[1],
          close: item[2],
          high: item[3],
          low: item[4],
          volume: item[5],
          name: data.data.symbol_name || symbol,
          source: "雪球",
        }
      })

      return marketData
    } catch (error) {
      console.error("获取雪球K线数据失败，使用模拟数据:", error)
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
        { symbol: "SH510050", name: "50ETF" },
        { symbol: "SH510300", name: "300ETF" },
        { symbol: "SH510500", name: "500ETF" },
        { symbol: "SH512880", name: "证券ETF" },
        { symbol: "SH512690", name: "酒ETF" },
        { symbol: "SH512170", name: "医疗ETF" },
        { symbol: "SH512760", name: "芯片ETF" },
        { symbol: "SH512480", name: "半导体ETF" },
        { symbol: "SH512980", name: "传媒ETF" },
        { symbol: "SH512800", name: "银行ETF" },
        { symbol: "SH512200", name: "地产ETF" },
        { symbol: "SH512660", name: "军工ETF" },
        { symbol: "SH159915", name: "创业板ETF" },
        { symbol: "SH588000", name: "科创50ETF" },
      ]
    } catch (error) {
      console.error("获取雪球股票列表失败:", error)
      return []
    }
  }

  /**
   * 获取指数列表
   * @returns 指数代码和名称列表
   */
  async getIndexList(): Promise<{ symbol: string; name: string }[]> {
    return [
      { symbol: "SH000001", name: "上证指数" },
      { symbol: "SH000300", name: "沪深300" },
      { symbol: "SH000905", name: "中证500" },
      { symbol: "SH000016", name: "上证50" },
      { symbol: "SZ399001", name: "深证成指" },
      { symbol: "SZ399006", name: "创业板指" },
      { symbol: "SH000688", name: "科创50" },
    ]
  }
}
