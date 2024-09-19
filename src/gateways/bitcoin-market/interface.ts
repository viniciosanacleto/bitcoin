import { BitcoinPrice } from "./types";

export interface BitcoinMarketGatewayInterface {
  getLastPrice: () => Promise<BitcoinPrice>;
}
