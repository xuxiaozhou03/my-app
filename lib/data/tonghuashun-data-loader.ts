import type { MarketData } from "../strategy/strategy-base"
import { MockDataGenerator } from "./mock-data-generator"

/**
 * 同花顺数据加载器
 * 从同花顺网站API获取K线数据
 */
export class TongHuaShunDataLoader {
  /**
   * 加载K线数据
   * @param symbol 股票代码（格式：1.000001、0.399001等）
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 市场数据数组
   */
  async loadData(symbol: string, startDate: Date, endDate: Date): Promise<MarketData[]> {
    try {
      // 将东方财富格式转换为同花顺格式
      let thsSymbol = symbol
      if (symbol.startsWith("sh")) {
        thsSymbol = `1.${symbol.substring(2)}`
      } else if (symbol.startsWith("sz")) {
        thsSymbol = `0.${symbol.substring(2)}`
      }

      // 格式化日期为YYYYMMDD格式
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}${month}${day}`
      }

      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)

      // 构建API URL
      const url = `https://d.10jqka.com.cn/v2/line/hs_${thsSymbol}/01/${startDateStr}_${endDateStr}.js`

      // 发起请求
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Referer: "http://stockpage.10jqka.com.cn/",
        },
      })

      // 同花顺返回的是JSONP格式，需要处理
      const text = await response.text()
      const jsonStr = text.match(/\{.*\}/)?.[0]

      if (!jsonStr) {
        console.warn("未能获取到同花顺K线数据，使用模拟数据", text)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      const data = JSON.parse(jsonStr)

      // 检查是否成功获取数据
      if (!data.data) {
        console.warn("未能获取到同花顺K线数据，使用模拟数据", data)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      // 解析K线数据
      // 同花顺K线格式：日期:开盘价,最高价,最低价,收盘价,成交量,成交额
      const marketData: MarketData[] = []

      for (const dateStr in data.data) {
        const values = data.data[dateStr].split(",")

        // 解析日期 (格式: YYYYMMDD)
        const year = Number.parseInt(dateStr.substring(0, 4))
        const month = Number.parseInt(dateStr.substring(4, 6)) - 1
        const day = Number.parseInt(dateStr.substring(6, 8))
        const date = new Date(year, month, day)

        marketData.push({
          symbol: symbol,
          timestamp: date,
          open: Number.parseFloat(values[0]),
          high: Number.parseFloat(values[1]),
          low: Number.parseFloat(values[2]),
          close: Number.parseFloat(values[3]),
          volume: Number.parseFloat(values[4]),
          name: data.name || symbol,
          source: "同花顺",
        })
      }

      return marketData
    } catch (error) {
      console.error("获取同花顺K线数据失败，使用模拟数据:", error)
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
        { symbol: "1.510050", name: "50ETF" },
        { symbol: "1.510300", name: "300ETF" },
        { symbol: "1.510500", name: "500ETF" },
        { symbol: "1.512880", name: "证券ETF" },
        { symbol: "1.512690", name: "酒ETF" },
        { symbol: "1.512170", name: "医疗ETF" },
        { symbol: "1.512760", name: "芯片ETF" },
        { symbol: "1.512480", name: "半导体ETF" },
        { symbol: "1.512980", name: "传媒ETF" },
        { symbol: "1.512800", name: "银行ETF" },
        { symbol: "1.512200", name: "地产ETF" },
        { symbol: "1.512660", name: "军工ETF" },
      ]
    } catch (error) {
      console.error("获取同花顺股票列表失败:", error)
      return []
    }
  }

  /**
   * 获取指数列表
   * @returns 指数代码和名称列表
   */
  async getIndexList(): Promise<{ symbol: string; name: string }[]> {
    return [
      { symbol: "1.000001", name: "上证指数" },
      { symbol: "1.000300", name: "沪深300" },
      { symbol: "1.000905", name: "中证500" },
      { symbol: "1.000016", name: "上证50" },
      { symbol: "0.399001", name: "深证成指" },
      { symbol: "0.399006", name: "创业板指" },
      { symbol: "1.000688", name: "科创50" },
    ]
  }
}
