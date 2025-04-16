// 获取A股ETF列表
export async function fetchETFList() {
  try {
    // 在实际应用中，这里应该调用真实的API
    // 由于浏览器环境限制，我们使用模拟数据
    return generateMockETFList()
  } catch (error) {
    console.error("获取ETF列表失败:", error)
    return []
  }
}

// 获取ETF的K线数据
export async function fetchKLineData(code: string) {
  try {
    // 在实际应用中，这里应该调用真实的API
    // 由于浏览器环境限制，我们使用模拟数据
    return generateMockKLineData(code)
  } catch (error) {
    console.error(`获取 ${code} K线数据失败:`, error)
    return []
  }
}

// 生成模拟ETF列表
function generateMockETFList() {
  const etfList = [
    { code: "510300", name: "沪深300ETF", price: 3.85, change: 0.52 },
    { code: "510500", name: "中证500ETF", price: 6.23, change: -0.32 },
    { code: "510050", name: "上证50ETF", price: 2.76, change: 0.73 },
    { code: "159915", name: "创业板ETF", price: 2.41, change: -0.82 },
    { code: "512880", name: "证券ETF", price: 0.98, change: 1.03 },
  ]

  return etfList
}

// 生成模拟K线数据
function generateMockKLineData(code: string) {
  const mockKLineData = []
  let basePrice

  // 根据ETF代码设置不同的基准价格
  switch (code) {
    case "510300":
      basePrice = 3.8
      break
    case "510500":
      basePrice = 6.2
      break
    case "510050":
      basePrice = 2.7
      break
    case "159915":
      basePrice = 2.4
      break
    case "512880":
      basePrice = 0.95
      break
    default:
      basePrice = 3.0
  }

  const today = new Date()

  // 生成过去60天的K线数据
  for (let i = 60; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    // 生成随机价格波动，但保持一定的趋势性
    const trend = Math.sin(i / 10) * 0.1 // 添加周期性趋势
    const randomFactor = 0.02 * (Math.random() - 0.5)
    const open = basePrice * (1 + trend + randomFactor)
    const high = open * (1 + Math.random() * 0.01)
    const low = open * (1 - Math.random() * 0.01)
    const close = (open + high + low) / 3 + randomFactor * basePrice

    mockKLineData.push({
      date: dateStr,
      open: open.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: Math.floor(Math.random() * 10000000),
    })
  }

  return mockKLineData
}
