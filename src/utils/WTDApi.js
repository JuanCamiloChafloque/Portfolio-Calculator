import axios from "axios";

const API_KEY = "SV2RAVRTE4ZMY20U";
const BASE_URL = "https://www.alphavantage.co/query?apikey=" + API_KEY;

export const getHistoricalDataBySymbol = async (symbol) => {
  const { data } = await axios.get(
    BASE_URL +
      `&function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${symbol}`
  );

  return data;
};

// *Keyword: The keyword is the name of the symbol that the user is currently typing in the autocomplete dropdown selector.
export const getAllSymbols = async (keyword) => {
  const { data } = await axios.get(
    BASE_URL + `&function=SYMBOL_SEARCH&keywords=${keyword}`
  );
  const result = data["bestMatches"].map((s) => {
    return {
      name: s["2. name"],
      symbol: s["1. symbol"],
    };
  });

  return result;
};
