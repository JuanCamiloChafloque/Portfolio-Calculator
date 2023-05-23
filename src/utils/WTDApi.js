import axios from "axios";

const API_KEY = "YRS7K3XG23PGSVX5";
const BASE_URL = "https://www.alphavantage.co/query?apikey=" + API_KEY;

export const getHistoricalDataBySymbol = async (startDate, symbol, amount) => {
  const today = new Date().toISOString().substring(0, 10);
  let totalAmount = 0.0;

  const { data } = await axios.get(
    BASE_URL +
      `&function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${symbol}`
  );

  const filteredData = Object.entries(data["Time Series (Daily)"]).filter(
    ([key, _]) => key >= startDate && key <= today
  );

  const res = filteredData.reverse().map((entry) => {
    totalAmount += amount * entry[1]["4. close"];
    return {
      date: entry[0],
      symbol: symbol,
      close: entry[1]["4. close"],
      adjusted_close: entry[1]["5. adjusted close"],
    };
  });

  return { res, totalAmount };
};

// *Keyword: The keyword is the name of the symbol that the user is currently typing in the autocomplete dropdown selector.
export const getAllSymbols = async (keyword) => {
  const { data } = await axios.get(
    BASE_URL + `&function=SYMBOL_SEARCH&keywords=${keyword}`
  );
  console.log(data);
  const res = data["bestMatches"].map((s) => {
    return {
      name: s["2. name"],
      symbol: s["1. symbol"],
    };
  });

  return res;
};
