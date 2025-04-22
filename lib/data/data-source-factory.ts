import { EastMoneyDataLoader } from "./eastmoney-data-loader"
import { XueQiuDataLoader } from "./xueqiu-data-loader"
import { TongHuaShunDataLoader } from "./tonghuashun-data-loader"
import { SinaDataLoader } from "./sina-data-loader"
import type { MarketData } from "../strategy/strategy-base"

export type DataSourceType = "eastmoney" | "xueqiu" | "tonghuashun" | "sina"

/**
 * 数据源工厂类
 * 用于创建和管理不同的数据源
 */
export class DataSourceFactory {
  private static instance: DataSourceFactory
  private dataSources: Map<DataSourceType, any> = new Map()

  private constructor() {
    this.dataSources.set("eastmoney", new EastMoneyDataLoader())
    this.dataSources.set("xueqiu", new XueQiuDataLoader())
    this.dataSources.set("tonghuashun", new TongHuaShunDataLoader())
    this.dataSources.set("sina", new SinaDataLoader())
  }

  /**
   * 获取工厂实例（单例模式）
   */
  public static getInstance(): DataSourceFactory {
    if (!DataSourceFactory.instance) {
      DataSourceFactory.instance = new DataSourceFactory()
    }
    return DataSourceFactory.instance
  }

  /**
   * 获取数据源
   * @param type 数据源类型
   */
  public getDataSource(type: DataSourceType): any {
    return this.dataSources.get(type)
  }

  /**
   * 获取所有数据源类型
   */
  public getDataSourceTypes(): DataSourceType[] {
    return Array.from(this.dataSources.keys())
  }

  /**
   * 获取数据源名称
   */
  public getDataSourceNames(): { value: DataSourceType; label: string }[] {
    return [
      { value: "eastmoney", label: "东方财富" },
      { value: "xueqiu", label: "雪球" },
      { value: "tonghuashun", label: "同花顺" },
      { value: "sina", label: "新浪财经" },
    ]
  }

  /**
   * 从指定数据源加载数据
   * @param type 数据源类型
   * @param symbol 股票代码
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  public async loadData(type: DataSourceType, symbol: string, startDate: Date, endDate: Date): Promise<MarketData[]> {
    const dataSource = this.getDataSource(type)
    if (!dataSource) {
      throw new Error(`未找到数据源: ${type}`)
    }
    return await dataSource.loadData(symbol, startDate, endDate)
  }

  /**
   * 从指定数据源获取股票列表
   * @param type 数据源类型
   */
  public async getSymbolList(type: DataSourceType): Promise<{ symbol: string; name: string }[]> {
    const dataSource = this.getDataSource(type)
    if (!dataSource) {
      throw new Error(`未找到数据源: ${type}`)
    }
    return await dataSource.getSymbolList()
  }

  /**
   * 从指定数据源获取指数列表
   * @param type 数据源类型
   */
  public async getIndexList(type: DataSourceType): Promise<{ symbol: string; name: string }[]> {
    const dataSource = this.getDataSource(type)
    if (!dataSource) {
      throw new Error(`未找到数据源: ${type}`)
    }
    return await dataSource.getIndexList()
  }
}
