import type { MarketData } from "../strategy/strategy-base"
import { MockDataGenerator } from "./mock-data-generator"

/**
 * K线数据周期枚举
 */
export enum KlinePeriod {
  MIN1 = 1, // 1分钟
  MIN5 = 5, // 5分钟
  MIN15 = 15, // 15分钟
  MIN30 = 30, // 30分钟
  MIN60 = 60, // 60分钟
  DAILY = 101, // 日线
  WEEKLY = 102, // 周线
  MONTHLY = 103, // 月线
}

/**
 * 复权类型枚举
 */
export enum AdjustType {
  NONE = 0, // 不复权
  FORWARD = 1, // 前复权
  BACKWARD = 2, // 后复权
}

/**
 * K线数据结构
 */
export interface KLineData {
  date: string // 日期
  open: number // 开盘价
  close: number // 收盘价
  high: number // 最高价
  low: number // 最低价
  volume: number // 成交量
  amount: number // 成交额
  amplitude: number // 振幅
  change: number // 涨跌额
  changePercent: number // 涨跌幅
  turnoverRate?: number // 换手率
}

/**
 * 东方财富数据加载器
 * 直接从东方财富网API获取K线数据
 */
export class EastMoneyDataLoader {
  /**
   * 加载K线数据
   * @param symbol 股票代码（格式：sh000001、sz399001、sh600000等）
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param period 周期（默认为日K线：101）
   * @returns 市场数据数组
   */
  async loadData(
    symbol: string,
    startDate: Date,
    endDate: Date,
    period: KlinePeriod = KlinePeriod.DAILY,
  ): Promise<MarketData[]> {
    try {
      // 格式化日期为YYYYMMDD格式
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}${month}${day}`
      }

      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)

      // 转换symbol格式 (sh000001 -> 000001)
      let stockCode = symbol
      if (symbol.startsWith("sh") || symbol.startsWith("sz")) {
        stockCode = symbol.substring(2)
      }

      // 获取市场代码
      const marketCode = this.getMarketCode(stockCode, symbol)

      // 构建API URL
      const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get"

      // 构建请求参数
      const params = {
        fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
        fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
        ut: "7eea3edcaed734bea9cbfc24409ed989",
        klt: period.toString(),
        fqt: AdjustType.FORWARD.toString(), // 使用前复权
        secid: `${marketCode}.${stockCode}`,
        beg: startDateStr,
        end: endDateStr,
        _: Date.now().toString(), // 添加时间戳防止缓存
      }

      // 构建URL查询字符串
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")

      // 发送请求
      const response = await fetch(`${url}?${queryString}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()

      // 检查响应状态
      if (result.rc !== 0 || !result.data || !result.data.klines) {
        console.warn("未能获取到K线数据，使用模拟数据", result)
        return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
      }

      // 解析K线数据
      const klineData = this.parseKLineData(result.data.klines)

      // 转换为MarketData格式
      const marketData: MarketData[] = klineData.map((kline) => {
        // 解析日期 (格式: YYYY-MM-DD)
        const [year, month, day] = kline.date.split("-").map(Number)
        const date = new Date(year, month - 1, day)

        return {
          symbol: stockCode,
          timestamp: date,
          open: kline.open,
          high: kline.high,
          low: kline.low,
          close: kline.close,
          volume: kline.volume,
          name: result.data.name || symbol,
          source: "东方财富",
        }
      })

      return marketData
    } catch (error) {
      console.error("获取K线数据失败，使用模拟数据:", error)
      return MockDataGenerator.generateKLineData(symbol, startDate, endDate)
    }
  }

  /**
   * 根据股票代码判断市场代码
   * @param stockCode 股票代码
   * @param originalSymbol 原始符号（包含市场前缀）
   * @returns 市场代码 (0: 深圳, 1: 上海, 105: 北京, 116: 港股, 128: 美股)
   */
  private getMarketCode(stockCode: string, originalSymbol: string): string {
    // 如果原始符号包含市场前缀，直接使用
    if (originalSymbol.startsWith("sh")) {
      return "1" // 上海
    } else if (originalSymbol.startsWith("sz")) {
      return "0" // 深圳
    }

    // 否则根据股票代码判断
    if (/^[0-9]{6}$/.test(stockCode)) {
      // 6位数字代码
      if (stockCode.startsWith("6")) {
        return "1" // 上海
      } else if (stockCode.startsWith("0") || stockCode.startsWith("3")) {
        return "0" // 深圳
      } else if (stockCode.startsWith("8") || stockCode.startsWith("4")) {
        return "105" // 北京
      }
    } else if (/^[0-9]{5}$/.test(stockCode)) {
      return "116" // 港股
    } else if (/^[A-Za-z]+$/.test(stockCode)) {
      return "128" // 美股
    }

    // 默认返回上海
    return "1"
  }

  /**
   * 解析K线数据字符串数组为结构化对象数组
   * @param klines K线数据字符串数组
   * @returns 解析后的K线数据对象数组
   */
  private parseKLineData(klines: string[]): KLineData[] {
    return klines.map((line) => {
      // 东方财富K线数据格式: 日期,开盘价,收盘价,最高价,最低价,成交量,成交额,振幅,涨跌幅,涨跌额,换手率
      const [date, open, close, high, low, volume, amount, amplitude, changePercent, change, turnoverRate] =
        line.split(",")

      return {
        date,
        open: Number.parseFloat(open),
        close: Number.parseFloat(close),
        high: Number.parseFloat(high),
        low: Number.parseFloat(low),
        volume: Number.parseFloat(volume),
        amount: Number.parseFloat(amount),
        amplitude: Number.parseFloat(amplitude),
        changePercent: Number.parseFloat(changePercent),
        change: Number.parseFloat(change),
        turnoverRate: turnoverRate ? Number.parseFloat(turnoverRate) : undefined,
      }
    })
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
        { symbol: "sh159915", name: "创业板ETF" },
        { symbol: "sh588000", name: "科创50ETF" },
        { symbol: "sh513050", name: "中概互联ETF" },
        { symbol: "sh513100", name: "纳指ETF" },
        { symbol: "sh513500", name: "标普500ETF" },
      ]
    } catch (error) {
      console.error("获取股票列表失败:", error)
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
