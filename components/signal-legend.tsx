"use client"

export default function SignalLegend({ signals }) {
  if (!signals || signals.length === 0) {
    return null
  }

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">交易信号</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
          <span>买入信号</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>卖出信号</span>
        </div>
      </div>
      <div className="mt-4 max-h-40 overflow-y-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">日期</th>
              <th className="text-left">类型</th>
              <th className="text-right">价格</th>
              <th className="text-left">原因</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{signal.date}</td>
                <td className="py-2">
                  <span className={signal.type === "BUY" ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                    {signal.type === "BUY" ? "买入" : "卖出"}
                  </span>
                </td>
                <td className="py-2 text-right">{signal.price.toFixed(2)}</td>
                <td className="py-2">{signal.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
