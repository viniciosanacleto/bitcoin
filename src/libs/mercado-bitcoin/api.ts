import { BitcoinMarketGatewayInterface } from "../../gateways/bitcoin-market/interface";
import { BitcoinPrice } from "../../gateways/bitcoin-market/types";
import { BASE_URL } from "./contants";
import { TickerResponse } from "./types";
import axios from "axios";

export class MercadoBitcoinAPI implements BitcoinMarketGatewayInterface {
  async getLastPrice(): Promise<BitcoinPrice> {
    const url = `${BASE_URL}/ticker`;
    const res = await axios.get<TickerResponse>(url, {
      timeout: 5000,
    });

    if (res.status !== 200) {
      throw new Error(
        `Failed to getLastPrice: StatusCode=${res.status}, response="${res.statusText}"`
      );
    }

    if (
      !res.data?.ticker ||
      !res.data?.ticker?.buy ||
      !res.data?.ticker?.sell ||
      !res.data?.ticker?.date
    ) {
      throw new Error("The response cannot be converted ot a BitcoinPrice");
    }
    return {
      buy: Number(res.data.ticker.buy),
      sell: Number(res.data.ticker.sell),
      timestamp: res.data.ticker.date,
    };
  }
}
