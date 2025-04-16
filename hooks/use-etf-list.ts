import { EtfList, fetchETFList } from "@/lib/service/etfList";
import { useEffect, useState } from "react";

const useEtfList = () => {
  const [loading, setLoading] = useState(false);
  const [etfList, setEtfList] = useState<EtfList>([]);
  const [selectedETF, setSelectedETF] = useState<EtfList[0] | null>(null);

  // Load ETF list on component mount
  useEffect(() => {
    const loadETFList = async () => {
      try {
        setLoading(true);
        const list = await fetchETFList();
        setEtfList(list.slice(0, 10));
        if (list.length > 0) {
          setSelectedETF(list[0]);
        }
      } catch (error) {
        console.error("Failed to load ETF list:", error);
      } finally {
        setLoading(false);
      }
    };

    loadETFList();
  }, []);

  return {
    etfList,
    selectedETF,
    loading,
    handleETFChange(code: string) {
      const etf = etfList.find((e) => e.symbol === code);
      setSelectedETF(etf || null);
    },
  };
};

export default useEtfList;
