"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { StrategyCodeEditor } from "@/components/strategies/strategy-code-editor"
import { StrategyParameters } from "@/components/strategies/strategy-parameters"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Strategy name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.string({
    required_error: "Please select a strategy type.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  dataSource: z.string({
    required_error: "Please select a data source.",
  }),
  isActive: z.boolean().default(false),
})

export function StrategyForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically save the strategy to your backend
    router.push("/strategies")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="parameters">参数</TabsTrigger>
            <TabsTrigger value="code">策略代码</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>策略名称</FormLabel>
                        <FormControl>
                          <Input placeholder="移动平均线交叉" {...field} />
                        </FormControl>
                        <FormDescription>为您的交易策略取一个独特的名称。</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>策略类型</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择策略类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">技术分析</SelectItem>
                            <SelectItem value="fundamental">基本面分析</SelectItem>
                            <SelectItem value="statistical">统计分析</SelectItem>
                            <SelectItem value="ml">机器学习</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>您的策略使用的分析类型。</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>类别</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择类别" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="trend">趋势跟踪</SelectItem>
                            <SelectItem value="momentum">动量</SelectItem>
                            <SelectItem value="mean-reversion">均值回归</SelectItem>
                            <SelectItem value="volatility">波动率</SelectItem>
                            <SelectItem value="ml">机器学习</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>最能描述您策略的类别。</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>数据源</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择数据源" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alpha-vantage">Alpha Vantage</SelectItem>
                            <SelectItem value="quandl">Quandl</SelectItem>
                            <SelectItem value="coinbase">Coinbase Pro</SelectItem>
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>您的策略将使用的数据源。</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="描述您的策略..." className="resize-none" {...field} />
                          </FormControl>
                          <FormDescription>详细描述您的策略如何运作。</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">激活策略</FormLabel>
                          <FormDescription>创建后立即激活此策略。</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters">
            <StrategyParameters />
          </TabsContent>

          <TabsContent value="code">
            <StrategyCodeEditor />
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">高级设置</h3>
                  <p className="text-sm text-muted-foreground">配置策略的高级设置。</p>

                  {/* Advanced settings would go here */}
                  <div className="grid gap-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">风险管理</FormLabel>
                        <FormDescription>启用自动风险管理功能。</FormDescription>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">自动优化</FormLabel>
                        <FormDescription>定期优化策略参数。</FormDescription>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">性能提醒</FormLabel>
                        <FormDescription>当性能指标发生显著变化时接收提醒。</FormDescription>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.push("/strategies")}>
            取消
          </Button>
          <Button type="submit">保存策略</Button>
        </div>
      </form>
    </Form>
  )
}
