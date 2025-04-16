import { request } from "@/lib/request";
import * as cheerio from "cheerio";
import { EtfInfo } from "@/type";
import { extractJsonFromCallback } from "../utils";

export const fetchEtf = async (symbol: string) => {
  const data = await request(
    `https://fundf10.eastmoney.com/jbgk_${symbol}.html`
  );
  const $ = cheerio.load(data);

  // 成立时间 和 成立规模
  const establishDateAndScale = $(".info.w790 tr:eq(2) td:eq(1)").text();
  const [establishDate, establishScale] = establishDateAndScale.split(" / ");

  const result = {
    // 规模
    scale: parseFloat($(".info.w790 tr:eq(3) td:eq(0)").text()),
    // 跟踪标的
    trackingIndex: $(".info.w790 tr:eq(9) td:eq(1)").text(),
    // 业绩比较基准
    performanceBenchmark: $(".info.w790 tr:eq(9) td:eq(0)").text(),
    // 成立时间
    establishDate,
    // 成立规模
    establishScale,
  };
  return result;
};

export const fetchETFList = async () => {
  let allEtfs: Pick<EtfInfo, "name" | "symbol">[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await request("https://push2.eastmoney.com/api/qt/clist/get", {
      params: {
        np: page,
        fltt: 1,
        invt: 2,
        cb: "callback",
        fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827",
        fields: "f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16",
        fid: "f3",
        pn: page,
        pz: 200,
        po: 1,
        dect: 1,
        ut: "fa5fd1943c7b386f172d6893dbfba10b",
        wbp2u: "|0|0|0|web",
        _: Date.now(),
      },
    });
    const result = extractJsonFromCallback<{
      data: {
        diff:
          | Array<{ f12: string; f14: string }>
          | Record<
              string,
              {
                f12: string;
                f14: string;
              }
            >;
        total: number;
      };
    }>(data);
    if (!result?.data) {
      break;
    }
    if (Array.isArray(result.data.diff)) {
      allEtfs = [
        ...allEtfs,
        ...result.data.diff.map((etf) => ({
          symbol: etf.f12,
          name: etf.f14,
        })),
      ];
    } else if (typeof result.data.diff === "object") {
      allEtfs = [
        ...allEtfs,
        ...Object.values(result.data.diff).map((etf) => ({
          symbol: etf.f12,
          name: etf.f14,
        })),
      ];
    }

    totalPages = Math.ceil(result.data.total / 200);
    page++;
  }

  return allEtfs;
};

export type EtfList = Awaited<ReturnType<typeof fetchETFList>>;
