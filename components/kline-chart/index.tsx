import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Import KLineChart component dynamically to avoid SSR issues
const KLineChart = dynamic(
  () => import("@/components/kline-chart/kline-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export default KLineChart;
