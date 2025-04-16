"use client";
import { KLineChartPro } from "@klinecharts/pro";
import "@klinecharts/pro/dist/klinecharts-pro.css";
import React from "react";
import CustomDatafeed from "./datafeed";
import "./index.css";

const Klinecharts = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<KLineChartPro | null>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    if (chartRef.current) {
      chartRef.current = null;
    }
    // 创建实例
    chartRef.current = new KLineChartPro({
      container: containerRef.current!,
      // 初始化标的信息
      symbol: {
        exchange: "XNYS",
        market: "stocks",
        name: "",
        ticker: "159612",
        priceCurrency: "usd",
        type: "ADRC",
      },
      // 初始化周期
      period: { multiplier: 1, timespan: "day", text: "日K" },
      datafeed: new CustomDatafeed(),
      drawingBarVisible: false,
      mainIndicators: ["BOLL"],
      periods: [
        { multiplier: 1, timespan: "day", text: "日K" },
        { multiplier: 1, timespan: "week", text: "周K" },
        { multiplier: 1, timespan: "month", text: "月K" },
      ],
    });
  }, []);

  // 标记买卖点
  // const buySignals = [];
  // const sellSignals = [];

  // signals.forEach((signal) => {
  //   const dataPoint = {
  //     x: new Date(signal.date).getTime(),
  //     y: Number.parseFloat(signal.price),
  //   };

  //   if (signal.type === "BUY") {
  //     buySignals.push(dataPoint);
  //   } else {
  //     sellSignals.push(dataPoint);
  //   }
  // });

  return <div ref={containerRef} className="w-full h-full chart"></div>;
};

export default Klinecharts;
