import { fetchKLineData } from "@/lib/service/klineData";
import { backtest, calculateBOLL, runBollStrategy } from "@/lib/strategy";
import { KLineData } from "@/type";
import { useEffect, useMemo, useState } from "react";

const useEtfKlineData = (symbol?: string) => {
  const [loading, setLoading] = useState(false);
  const [klineData, setKlineData] = useState<KLineData[]>([]);

  useEffect(() => {
    const loadKLineData = async () => {
      if (!symbol) {
        return;
      }

      try {
        setLoading(true);
        const data = await fetchKLineData(symbol);
        setKlineData(data);
      } catch (error) {
        console.error("Failed to load K-line data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadKLineData();
  }, [symbol]);
  return {
    loading,
    klineData,
  };
};

// Calculate additional metrics
const calculateMetrics = () => {
  // Maximum drawdown
  let maxDrawdown = 0;
  let peak = result.initialCapital;

  for (const point of result.equityCurve) {
    if (point.equity > peak) {
      peak = point.equity;
    }

    const drawdown = ((peak - point.equity) / peak) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }

  // Annualized return
  const annualReturn =
    (Math.pow(result.finalAsset / result.initialCapital, 365 / days) - 1) * 100;

  // Sharpe ratio (simplified, assuming risk-free rate of 3%)
  const riskFreeRate = 3;
  const returns = result.equityCurve.map((point, i, arr) => {
    if (i === 0) return 0;
    return ((point.equity - arr[i - 1].equity) / arr[i - 1].equity) * 100;
  });

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdReturn = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
      returns.length
  );

  const dailySharpe = (avgReturn - riskFreeRate / 365) / (stdReturn || 1); // Avoid division by zero
  const annualSharpe = dailySharpe * Math.sqrt(252);

  // Win rate
  let winTrades = 0;
  let loseTrades = 0;
  let totalProfit = 0;
  let totalLoss = 0;

  for (let i = 0; i < result.trades.length; i += 2) {
    if (i + 1 < result.trades.length) {
      const buyTrade = result.trades[i];
      const sellTrade = result.trades[i + 1];

      const profit =
        (sellTrade.price - buyTrade.price) * buyTrade.shares -
        buyTrade.totalCost -
        sellTrade.totalCost;

      if (profit > 0) {
        winTrades++;
        totalProfit += profit;
      } else {
        loseTrades++;
        totalLoss += Math.abs(profit);
      }
    }
  }

  const winRate = (winTrades / (winTrades + loseTrades || 1)) * 100;
  const avgWin = winTrades > 0 ? totalProfit / winTrades : 0;
  const avgLoss = loseTrades > 0 ? totalLoss / loseTrades : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  return {
    maxDrawdown,
    annualReturn,
    annualSharpe,
    winRate,
    avgWin,
    avgLoss,
    profitFactor,
  };
};

const useBacktest = (symbol?: string) => {
  const { klineData, loading } = useEtfKlineData(symbol);
  const [initialCapital, setInitialCapital] = useState(100000);

  const result = useMemo(() => {
    if (!klineData || klineData.length === 0) {
      return null;
    }
    // Calculate BOLL indicator
    const boll = calculateBOLL(klineData);

    // Run BOLL strategy
    const strategySignals = runBollStrategy(boll);

    // Run backtest
    const backtestResult = backtest(klineData, strategySignals, initialCapital);

    return { backtestResult, strategySignals };
  }, [klineData, initialCapital]);

  return {
    backtestResult: result?.backtestResult,
    signals: result?.strategySignals,
    initialCapital,
    total: klineData.length,
  };
};

export default useBacktest;
