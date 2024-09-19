export type TickerResponse = {
  ticker: {
    high: string;
    low: string;
    vol: string;
    last: string;
    buy: string;
    sell: string;
    open: string;
    date: number;
    pair: string;
  };
};
