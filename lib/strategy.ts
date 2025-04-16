import { KLineData } from "@/type";
import { bollingerBands } from "indicatorts";

// 计算布林带指标
export function calculateBOLL(klineData: KLineData[]) {
  const bollData = bollingerBands(klineData.map((k) => k.close));

  return klineData.map((k, i) => ({
    ...k,
    ma: bollData.middle[i],
    upper: bollData.upper[i],
    lower: bollData.lower[i],
  }));
}

// 实现BOLL策略
export function runBollStrategy(bollData) {
  const signals = [];
  let position = 0; // 0: 无仓位, 1: 持有多头

  for (let i = 1; i < bollData.length; i++) {
    const prev = bollData[i - 1];
    const curr = bollData[i];

    if (!prev.ma || !curr.ma) continue;

    // 策略逻辑：
    // 1. 当收盘价从下轨下方向上突破下轨，买入信号
    // 2. 当收盘价从上轨上方向下突破上轨，卖出信号

    if (position === 0 && prev.close <= prev.lower && curr.close > curr.lower) {
      // 买入信号
      signals.push({
        date: curr.date,
        type: "BUY",
        price: curr.close,
        reason: "价格突破布林带下轨",
        index: i,
      });
      position = 1;
    } else if (
      position === 1 &&
      prev.close >= prev.upper &&
      curr.close < curr.upper
    ) {
      // 卖出信号
      signals.push({
        date: curr.date,
        type: "SELL",
        price: curr.close,
        reason: "价格跌破布林带上轨",
        index: i,
      });
      position = 0;
    }
  }

  return signals;
}

// 交易成本计算器
function calculateTradingCosts(price, shares, isBuy = true) {
  // 交易成本参数
  const commissionRate = 0.0003; // 佣金费率，通常为万三
  const minCommission = 5; // 最低佣金，通常为5元
  const transferFee = 0.00002; // 过户费，按成交金额的0.002%（沪市特有）
  const stampDuty = 0.001; // 印花税，按成交金额的0.1%（仅卖出收取，ETF免征）
  const slippageRate = 0.0002; // 滑点，假设为万二

  const amount = price * shares;

  // 计算佣金（不低于最低佣金）
  let commission = amount * commissionRate;
  commission = Math.max(commission, minCommission);

  // 计算过户费（仅沪市，深市不收）
  const transfer = amount * transferFee;

  // 计算印花税（仅卖出时收取，ETF免征）
  const stamp = isBuy ? 0 : 0; // ETF免征印花税

  // 计算滑点成本
  const slippage = amount * slippageRate;

  // 总交易成本
  const totalCost = commission + transfer + stamp + slippage;

  return {
    commission,
    transfer,
    stamp,
    slippage,
    totalCost,
  };
}

// 回测策略（包含交易成本）
export function backtest(
  klineData: KLineData[],
  signals,
  initialCapital = 100000
) {
  let capital = initialCapital;
  let shares = 0;
  const trades = [];
  let totalCommission = 0;
  let totalTransfer = 0;
  let totalStamp = 0;
  let totalSlippage = 0;

  // 记录资金曲线
  const equityCurve = klineData.map((k) => ({
    date: k.date,
    equity: initialCapital,
    position: 0,
  }));

  for (const signal of signals) {
    const signalDate = signal.date;
    const price = signal.price;
    const index = signal.index;

    if (signal.type === "BUY") {
      // 计算可买入的股数（考虑交易成本，预留约1%资金作为交易成本）
      const availableCapital = capital * 0.99;
      const potentialShares = Math.floor(availableCapital / price);

      // 计算交易成本
      const costs = calculateTradingCosts(price, potentialShares, true);

      // 实际可买入的股数（确保资金足够支付交易成本）
      shares = Math.floor((capital - costs.totalCost) / price);

      // 如果资金不足以买入至少1股，则跳过
      if (shares < 1) {
        console.log(`${signalDate}: 资金不足，无法买入`);
        continue;
      }

      // 重新计算实际交易成本
      const actualCosts = calculateTradingCosts(price, shares, true);

      // 更新资金
      const costAmount = shares * price + actualCosts.totalCost;
      capital -= costAmount;

      // 累计交易成本
      totalCommission += actualCosts.commission;
      totalTransfer += actualCosts.transfer;
      totalStamp += actualCosts.stamp;
      totalSlippage += actualCosts.slippage;

      // 记录交易
      trades.push({
        date: signalDate,
        action: "买入",
        price,
        shares,
        commission: actualCosts.commission,
        transfer: actualCosts.transfer,
        stamp: actualCosts.stamp,
        slippage: actualCosts.slippage,
        totalCost: actualCosts.totalCost,
        costPercentage:
          ((actualCosts.totalCost / (shares * price)) * 100).toFixed(4) + "%",
        capital,
        total: capital + shares * price,
        index,
      });

      // 更新资金曲线
      for (let i = index; i < equityCurve.length; i++) {
        equityCurve[i].position = shares;
        equityCurve[i].equity = capital + shares * klineData[i].close;
      }
    } else if (signal.type === "SELL" && shares > 0) {
      // 计算交易成本
      const costs = calculateTradingCosts(price, shares, false);

      // 更新资金
      const sellAmount = shares * price - costs.totalCost;
      capital += sellAmount;

      // 累计交易成本
      totalCommission += costs.commission;
      totalTransfer += costs.transfer;
      totalStamp += costs.stamp;
      totalSlippage += costs.slippage;

      // 记录交易
      trades.push({
        date: signalDate,
        action: "卖出",
        price,
        shares,
        commission: costs.commission,
        transfer: costs.transfer,
        stamp: costs.stamp,
        slippage: costs.slippage,
        totalCost: costs.totalCost,
        costPercentage:
          ((costs.totalCost / (shares * price)) * 100).toFixed(4) + "%",
        capital,
        total: capital,
        index,
      });

      // 更新资金曲线
      for (let i = index; i < equityCurve.length; i++) {
        equityCurve[i].position = 0;
        equityCurve[i].equity = capital;
      }

      shares = 0;
    }
  }

  // 计算最终资产
  const lastPrice = klineData[klineData.length - 1].close;
  const finalAsset = capital + shares * lastPrice;
  const returns = ((finalAsset - initialCapital) / initialCapital) * 100;

  // 计算总交易成本
  const totalCosts =
    totalCommission + totalTransfer + totalStamp + totalSlippage;

  // 计算交易成本对收益的影响
  const returnsWithoutCosts =
    ((finalAsset + totalCosts - initialCapital) / initialCapital) * 100;
  const costImpact = returnsWithoutCosts - returns;

  return {
    initialCapital,
    finalAsset,
    returns: returns.toFixed(2) + "%",
    totalTrades: trades.length,
    tradingCosts: {
      commission: totalCommission,
      transfer: totalTransfer,
      stamp: totalStamp,
      slippage: totalSlippage,
      total: totalCosts,
      percentage: ((totalCosts / initialCapital) * 100).toFixed(2) + "%",
    },
    costImpact: costImpact.toFixed(2) + "%",
    returnsWithoutCosts: returnsWithoutCosts.toFixed(2) + "%",
    trades,
    equityCurve,
  };
}
