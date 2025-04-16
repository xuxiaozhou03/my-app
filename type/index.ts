export interface EtfInfo {
  symbol: string;
  name: string;
  scale: number;
  trackingIndex: string;
  performanceBenchmark: string;
}

export interface KLineData {
  // 日期;
  date: string;
  // 开盘;
  open: number;
  // 收盘;
  close: number;
  // 最高;
  high: number;
  // 最低;
  low: number;
  // 成交量;
  volume: number;
  // 成交额;
  amount: number;
  // 振幅;
  amplitude: number;
  // 涨跌幅; 翻译
  percent: number;
  // 涨跌额, 翻译
  change: number;
  // 换手率;
  turnover: number;
}
