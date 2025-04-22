"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface StrategyEditorProps {
  strategyCode: string
  onCodeChange: (code: string) => void
}

export function StrategyEditor({ strategyCode, onCodeChange }: StrategyEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: "ma-cross",
      name: "移动平均线交叉策略",
      description: "基于快速和慢速移动平均线交叉的经典趋势跟踪策略",
      code: `/**
 * 移动平均线交叉策略
 */
class MovingAverageStrategy extends Strategy {
  constructor() {
    super();
    this.name = "移动平均线交叉策略";
    this.description = "基于快速和慢速移动平均线交叉的经典趋势跟踪策略";
    
    // 定义策略参数
    this.params = {
      fastPeriod: 12,
      slowPeriod: 26
    };
    
    // 初始化指标
    this.fastMA = new SMA(this.params.fastPeriod);
    this.slowMA = new SMA(this.params.slowPeriod);
  }
  
  initialize() {
    // 重置指标
    this.fastMA.reset();
    this.slowMA.reset();
  }
  
  onData(data) {
    // 更新指标
    const fastValue = this.fastMA.update(data.close);
    const slowValue = this.slowMA.update(data.close);
    
    // 生成交易信号
    if (fastValue > slowValue && this.position <= 0) {
      // 快线上穿慢线，买入信号
      return SignalType.BUY;
    } else if (fastValue < slowValue && this.position >= 0) {
      // 快线下穿慢线，卖出信号
      return SignalType.SELL;
    }
    
    // 无信号，保持当前状态
    return SignalType.HOLD;
  }
}

// 导出策略
return new MovingAverageStrategy();`,
    },
    {
      id: "rsi",
      name: "RSI策略",
      description: "基于相对强弱指标(RSI)的均值回归策略",
      code: `/**
 * RSI策略
 */
class RSIStrategy extends Strategy {
  constructor() {
    super();
    this.name = "RSI策略";
    this.description = "基于相对强弱指标(RSI)的均值回归策略";
    
    // 定义策略参数
    this.params = {
      period: 14,
      overbought: 70,
      oversold: 30
    };
    
    // 初始化指标
    this.rsi = new RSI(this.params.period);
  }
  
  initialize() {
    // 重置指标
    this.rsi.reset();
  }
  
  onData(data) {
    // 更新RSI
    const rsiValue = this.rsi.update(data.close);
    
    // 生成交易信号
    if (rsiValue < this.params.oversold && this.position <= 0) {
      // RSI低于超卖水平，买入信号
      return SignalType.BUY;
    } else if (rsiValue > this.params.overbought && this.position >= 0) {
      // RSI高于超买水平，卖出信号
      return SignalType.SELL;
    }
    
    // 无信号，保持当前状态
    return SignalType.HOLD;
  }
}

// 导出策略
return new RSIStrategy();`,
    },
    {
      id: "momentum",
      name: "动量策略",
      description: "基于价格变化率的动量交易策略",
      code: `/**
 * 动量策略
 */
class MomentumStrategy extends Strategy {
  constructor() {
    super();
    this.name = "动量策略";
    this.description = "基于价格变化率的动量交易策略";
    
    // 定义策略参数
    this.params = {
      lookbackPeriod: 20,
      threshold: 5
    };
    
    // 初始化价格数组
    this.prices = [];
  }
  
  initialize() {
    // 重置价格数组
    this.prices = [];
  }
  
  onData(data) {
    // 存储价格
    this.prices.push(data.close);
    
    // 如果没有足够的数据，保持当前状态
    if (this.prices.length <= this.params.lookbackPeriod) {
      return SignalType.HOLD;
    }
    
    // 保持数组长度
    if (this.prices.length > this.params.lookbackPeriod + 1) {
      this.prices.shift();
    }
    
    // 计算动量 (当前价格与N期前价格的百分比变化)
    const currentPrice = this.prices[this.prices.length - 1];
    const pastPrice = this.prices[0];
    const momentumValue = (currentPrice - pastPrice) / pastPrice * 100;
    
    // 基于动量值生成信号
    if (momentumValue > this.params.threshold && this.position <= 0) {
      // 动量为正且超过阈值，买入信号
      return SignalType.BUY;
    } else if (momentumValue < -this.params.threshold && this.position >= 0) {
      // 动量为负且超过阈值，卖出信号
      return SignalType.SELL;
    }
    
    // 无信号，保持当前状态
    return SignalType.HOLD;
  }
}

// 导出策略
return new MomentumStrategy();`,
    },
    {
      id: "ml",
      name: "机器学习策略",
      description: "使用简单线性回归预测价格变动的机器学习策略",
      code: `/**
 * 机器学习策略
 */
class MLStrategy extends Strategy {
  constructor() {
    super();
    this.name = "机器学习策略";
    this.description = "使用简单线性回归预测价格变动的机器学习策略";
    
    // 定义策略参数
    this.params = {
      lookback: 10,
      trainPeriod: 50,
      threshold: 0.01
    };
    
    // 初始化
    this.model = new LinearRegression(this.params.lookback);
    this.features = [];
    this.targets = [];
    this.prices = [];
    this.trained = false;
  }
  
  initialize() {
    // 重置
    this.features = [];
    this.targets = [];
    this.prices = [];
    this.trained = false;
  }
  
  onData(data) {
    // 存储价格
    this.prices.push(data.close);
    
    // 如果没有足够的数据，保持当前状态
    if (this.prices.length <= this.params.lookback + 1) {
      return SignalType.HOLD;
    }
    
    // 准备特征和目标
    const feature = this.prices.slice(-this.params.lookback - 1, -1).map(
      (price, i, arr) => (price / arr[0]) - 1 // 归一化
    );
    const target = (this.prices[this.prices.length - 1] / this.prices[this.prices.length - 2]) - 1;
    
    this.features.push(feature);
    this.targets.push(target);
    
    // 如果收集了足够的训练数据，训练模型
    if (!this.trained && this.features.length >= this.params.trainPeriod) {
      this.model.train(this.features, this.targets, 100);
      this.trained = true;
    }
    
    // 如果模型已训练，使用它来预测
    if (this.trained) {
      const prediction = this.model.predict(feature);
      
      // 基于预测生成信号
      if (prediction > this.params.threshold && this.position <= 0) {
        return SignalType.BUY;
      } else if (prediction < -this.params.threshold && this.position >= 0) {
        return SignalType.SELL;
      }
    }
    
    return SignalType.HOLD;
  }
}

// 导出策略
return new MLStrategy();`,
    },
  ]

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      onCodeChange(template.code)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>策略模板</CardTitle>
          <CardDescription>选择一个预定义的策略模板开始</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer rounded-md border p-4 hover:bg-accent ${
                  selectedTemplate === template.id ? "border-primary bg-accent" : ""
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>策略代码编辑器</CardTitle>
          <CardDescription>编写或修改您的交易策略代码</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={strategyCode}
            onChange={(e) => onCodeChange(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">重置</Button>
          <Button>保存策略</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
