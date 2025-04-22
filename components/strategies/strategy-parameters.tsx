"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"

export function StrategyParameters() {
  // 修改参数名称
  const [parameters, setParameters] = useState([
    { id: 1, name: "快速MA周期", value: 12, min: 1, max: 50 },
    { id: 2, name: "慢速MA周期", value: 26, min: 1, max: 100 },
    { id: 3, name: "信号周期", value: 9, min: 1, max: 20 },
  ])

  const addParameter = () => {
    const newId = parameters.length > 0 ? Math.max(...parameters.map((p) => p.id)) + 1 : 1
    setParameters([...parameters, { id: newId, name: "New Parameter", value: 10, min: 1, max: 100 }])
  }

  const removeParameter = (id: number) => {
    setParameters(parameters.filter((p) => p.id !== id))
  }

  const updateParameter = (id: number, field: string, value: any) => {
    setParameters(parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* 修改按钮和标签文本 */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">策略参数</h3>
            <Button variant="outline" size="sm" onClick={addParameter}>
              <Plus className="mr-2 h-4 w-4" />
              添加参数
            </Button>
          </div>

          <div className="space-y-4">
            {parameters.map((param) => (
              <div key={param.id} className="grid gap-4 border p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`param-name-${param.id}`}>参数名称</Label>
                    <Input
                      id={`param-name-${param.id}`}
                      value={param.name}
                      onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`param-value-${param.id}`}>值: {param.value}</Label>
                    <Input
                      id={`param-value-${param.id}`}
                      type="number"
                      value={param.value}
                      onChange={(e) => updateParameter(param.id, "value", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      范围: {param.min} - {param.max}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParameter(param.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider
                    defaultValue={[param.value]}
                    min={param.min}
                    max={param.max}
                    step={1}
                    onValueChange={(values) => updateParameter(param.id, "value", values[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`param-min-${param.id}`}>最小值</Label>
                    <Input
                      id={`param-min-${param.id}`}
                      type="number"
                      value={param.min}
                      onChange={(e) => updateParameter(param.id, "min", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`param-max-${param.id}`}>最大值</Label>
                    <Input
                      id={`param-max-${param.id}`}
                      type="number"
                      value={param.max}
                      onChange={(e) => updateParameter(param.id, "max", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}

            {parameters.length === 0 && (
              <div className="flex items-center justify-center h-32 border rounded-md">
                <p className="text-muted-foreground">未定义参数。点击"添加参数"创建一个。</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
