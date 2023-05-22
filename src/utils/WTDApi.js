import axios from "axios";

const API_KEY = "125361109e35d14cf042655f2f5785c0";
const BASE_URL = "http://api.marketstack.com/v1/";

export const getHistoricalDataBySymbol = async (
  startDate,
  symbol,
  amount,
  limit = 1000,
  offset = 0
) => {
  const today = new Date().toISOString().substring(0, 10);
  let totalAmount = 0.0;

  const { data } = await axios.get(
    BASE_URL +
      `eod?access_key=${API_KEY}&symbols=${symbol}&date_from=${startDate}&date_to=${today}&limit=${limit}&offset=${offset}`
  );

  const res = data.data.reverse().map((ex) => {
    totalAmount += amount * ex.close;
    return {
      date: ex.date.substring(0, 10),
      symbol: ex.symbol,
      close: ex.close,
    };
  });

  return { res, totalAmount };
};

export const getAllSymbols = async () => {
  const { data } = await axios.get(BASE_URL + `tickers?access_key=${API_KEY}`);
  const res = data.map((symbol) => {
    return {
      name: symbol.name,
      symbol: symbol.symbol,
    };
  });

  return res;
};
