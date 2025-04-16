import { KLineData } from "@/type";
import { klinefields } from "../constant";
import { request } from "../request";

export enum KlinePeriod {
  "daily" = "101",
  "weekly" = "102",
  "monthly" = "103",
}

export enum Adjust {
  "qfq" = "1",
  "hfq" = "2",
  "nfq" = "0",
}

const getMarketCode = (symbol: string) => {
  return symbol.startsWith("15") ? "0" : "1";
};

export async function fetchKLineData(
  symbol: string = "159707",
  period: KlinePeriod = KlinePeriod.daily,
  start_date: string = "20250101",
  end_date: string = "20500101",
  adjust: Adjust = Adjust.nfq
) {
  const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
  const params = {
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f116",
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    klt: period,
    fqt: adjust,
    beg: start_date,
    end: end_date,
    _: Date.now(),
    secid: `${getMarketCode(symbol)}.${symbol}`,
  };
  const result = await request(url, { params });
  const res = JSON.parse(result) as { data: { klines: string[] } };

  return res.data.klines.map((klineStr) => {
    const arr = klineStr.split(",");

    return klinefields.reduce((acc, field, index) => {
      if (index === 0) {
        acc[field as "date"] = arr[index];
        return acc;
      }
      acc[field as "open"] = parseFloat(arr[index]);
      return acc;
    }, {} as KLineData);
  });
}
