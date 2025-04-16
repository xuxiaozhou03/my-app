"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function KLineChart({ klineData, bollData, signals }) {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (
      !klineData ||
      klineData.length === 0 ||
      !bollData ||
      bollData.length === 0
    )
      return;

    // Prepare candlestick data
    const ohlc = klineData.map((item) => ({
      x: new Date(item.date).getTime(),
      y: [
        Number.parseFloat(item.open),
        Number.parseFloat(item.high),
        Number.parseFloat(item.low),
        Number.parseFloat(item.close),
      ],
    }));

    // Prepare BOLL data
    const bollMiddle = [];
    const bollUpper = [];
    const bollLower = [];

    bollData.forEach((item) => {
      const timestamp = new Date(item.date).getTime();

      if (item.ma !== null) {
        bollMiddle.push({
          x: timestamp,
          y: item.ma,
        });
      }

      if (item.upper !== null) {
        bollUpper.push({
          x: timestamp,
          y: item.upper,
        });
      }

      if (item.lower !== null) {
        bollLower.push({
          x: timestamp,
          y: item.lower,
        });
      }
    });

    // Prepare buy/sell signals
    const buySignals = [];
    const sellSignals = [];

    signals.forEach((signal) => {
      const dataPoint = {
        x: new Date(signal.date).getTime(),
        y: Number.parseFloat(signal.price),
      };

      if (signal.type === "BUY") {
        buySignals.push(dataPoint);
      } else {
        sellSignals.push(dataPoint);
      }
    });

    // Set chart series
    setChartData([
      {
        name: "K线",
        type: "candlestick",
        data: ohlc,
      },
      {
        name: "BOLL中轨",
        type: "line",
        data: bollMiddle,
      },
      {
        name: "BOLL上轨",
        type: "line",
        data: bollUpper,
      },
      {
        name: "BOLL下轨",
        type: "line",
        data: bollLower,
      },
      {
        name: "买入信号",
        type: "scatter",
        data: buySignals,
      },
      {
        name: "卖出信号",
        type: "scatter",
        data: sellSignals,
      },
    ]);

    // Set chart options
    setChartOptions({
      chart: {
        type: "candlestick",
        height: 500,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      title: {
        text: "K线图与BOLL指标",
        align: "left",
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
      grid: {
        borderColor: "#e0e0e0",
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#26A69A",
            downward: "#EF5350",
          },
          wick: {
            useFillColor: true,
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: [1, 2, 2, 2, 0, 0],
      },
      colors: [
        "#000000",
        "#FF9600",
        "#935EBD",
        "#935EBD",
        "#26A69A",
        "#EF5350",
      ],
      markers: {
        size: [0, 0, 0, 0, 6, 6],
        shape: "circle",
        colors: [
          "#000000",
          "#FF9600",
          "#935EBD",
          "#935EBD",
          "#26A69A",
          "#EF5350",
        ],
        strokeColors: [
          "#000000",
          "#FF9600",
          "#935EBD",
          "#935EBD",
          "#26A69A",
          "#EF5350",
        ],
        hover: {
          size: 8,
        },
      },
      tooltip: {
        shared: true,
        x: {
          format: "yyyy-MM-dd",
        },
        y: {
          formatter: (value, { seriesIndex, dataPointIndex, w }) => {
            if (seriesIndex === 0) {
              // For candlestick series, we don't use this formatter
              return value;
            }
            return value.toFixed(2);
          },
        },
      },
      legend: {
        show: true,
        position: "top",
      },
    });
  }, [klineData, bollData, signals]);

  // Create a separate chart for volume
  const [volumeChartData, setVolumeChartData] = useState(null);
  const [volumeChartOptions, setVolumeChartOptions] = useState(null);

  useEffect(() => {
    if (!klineData || klineData.length === 0) return;

    // Prepare volume data
    const volumeData = klineData.map((item) => ({
      x: new Date(item.date).getTime(),
      y: Number.parseFloat(item.volume),
    }));

    // Set volume chart series
    setVolumeChartData([
      {
        name: "成交量",
        data: volumeData,
      },
    ]);

    // Set volume chart options
    setVolumeChartOptions({
      chart: {
        type: "bar",
        height: 150,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (val) => (val / 1000000).toFixed(0) + "M",
        },
      },
      colors: ["#008FFB"],
      title: {
        text: "成交量",
        align: "left",
        style: {
          fontSize: "12px",
        },
      },
      tooltip: {
        enabled: true,
        x: {
          format: "yyyy-MM-dd",
        },
      },
    });
  }, [klineData]);

  if (
    !klineData ||
    klineData.length === 0 ||
    !chartData ||
    !chartOptions ||
    !volumeChartData ||
    !volumeChartOptions
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        {typeof window !== "undefined" && (
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type="candlestick"
            height={400}
          />
        )}
      </div>
      <div>
        {typeof window !== "undefined" && (
          <ReactApexChart
            options={volumeChartOptions}
            series={volumeChartData}
            type="bar"
            height={100}
          />
        )}
      </div>
    </div>
  );
}
