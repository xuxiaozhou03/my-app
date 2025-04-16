"use client";

export default function PerformanceMetrics({ result, total: days }) {
  if (!result) return null;

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
      (Math.pow(result.finalAsset / result.initialCapital, 365 / days) - 1) *
      100;

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

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">初始资金:</span>
          <span className="font-medium">
            {result.initialCapital.toFixed(2)} 元
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">最终资产:</span>
          <span className="font-medium">{result.finalAsset.toFixed(2)} 元</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">总收益率:</span>
          <span
            className={`font-medium ${
              Number.parseFloat(result.returns) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {result.returns}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">年化收益率:</span>
          <span
            className={`font-medium ${
              metrics.annualReturn >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {metrics.annualReturn.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">最大回撤:</span>
          <span className="font-medium text-red-600">
            {metrics.maxDrawdown.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">夏普比率:</span>
          <span className="font-medium">{metrics.annualSharpe.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">胜率:</span>
          <span className="font-medium">{metrics.winRate.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">平均盈利:</span>
          <span className="font-medium text-green-600">
            {metrics.avgWin.toFixed(2)} 元
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">平均亏损:</span>
          <span className="font-medium text-red-600">
            {metrics.avgLoss.toFixed(2)} 元
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">盈亏比:</span>
          <span className="font-medium">{metrics.profitFactor.toFixed(2)}</span>
        </div>
      </div>

      <div className="col-span-2 pt-4 border-t">
        <div className="text-lg font-medium mb-2">交易成本分析</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">佣金总额:</span>
              <span className="font-medium">
                {result.tradingCosts.commission.toFixed(2)} 元
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">过户费总额:</span>
              <span className="font-medium">
                {result.tradingCosts.transfer.toFixed(2)} 元
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">印花税总额:</span>
              <span className="font-medium">
                {result.tradingCosts.stamp.toFixed(2)} 元
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">滑点成本总额:</span>
              <span className="font-medium">
                {result.tradingCosts.slippage.toFixed(2)} 元
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">总交易成本:</span>
              <span className="font-medium">
                {result.tradingCosts.total.toFixed(2)} 元 (
                {result.tradingCosts.percentage})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">交易成本影响:</span>
              <span className="font-medium">{result.costImpact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
