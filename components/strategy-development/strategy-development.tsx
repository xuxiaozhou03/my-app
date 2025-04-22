"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategyEditor } from "./strategy-editor"
import { StrategyTester } from "./strategy-tester"
import { StrategyOptimizer } from "./strategy-optimizer"

export function StrategyDevelopment() {
  const [activeTab, setActiveTab] = useState("editor")
  const [strategyCode, setStrategyCode] = useState("")

  return (
    <Tabs defaultValue="editor" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="editor">策略编辑器</TabsTrigger>
        <TabsTrigger value="tester">策略回测</TabsTrigger>
        <TabsTrigger value="optimizer">参数优化</TabsTrigger>
      </TabsList>

      <TabsContent value="editor">
        <StrategyEditor strategyCode={strategyCode} onCodeChange={setStrategyCode} />
      </TabsContent>

      <TabsContent value="tester">
        <StrategyTester strategyCode={strategyCode} />
      </TabsContent>

      <TabsContent value="optimizer">
        <StrategyOptimizer strategyCode={strategyCode} />
      </TabsContent>
    </Tabs>
  )
}
