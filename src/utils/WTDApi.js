import axios from "axios";

// pranav's api key = "MYMC251UAARWJLXA"
// const API_KEY = "SV2RAVRTE4ZMY20U";
// nathanuel's api key

// NEED 2 SEPARATE API KEYS FOR SYMBOLS AND HISTORICAL DATA
const API_KEY = "MYMC251UAARWJLXA";

// symbol api key
const SYMBOL_API_KEY = "YYQSDHJWCB81GIU6";
const BASE_URL = "https://www.alphavantage.co/query?apikey=";

let isFetchingData = false;
export const getHistoricalDataBySymbol = async (symbol) => {
  if (isFetchingData) {
    // If a request is already in progress, wait until it completes
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getHistoricalDataBySymbol(symbol); // Retry the request after waiting
  }

  try {
    isFetchingData = true;
    console.log("starting getHistoricalDataBySymbol");
    const { data } = await axios.get(
      BASE_URL + API_KEY +
        `&function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${symbol}`
    );
  
    if (data.hasOwnProperty("Time Series (Daily)")) {
      console.log("ending getHistoricalDataBySymbol");
      return data["Time Series (Daily)"];
    }
    console.log("ending getHistoricalDataBySymbol without data");
    return data;
  } finally {
    isFetchingData = false;
  }
};

// *Keyword: The keyword is the name of the symbol that the user is currently typing in the autocomplete dropdown selector.
export const getAllSymbols = async (keyword) => {
  const { data } = await axios.get(
    BASE_URL + SYMBOL_API_KEY +
    `&function=SYMBOL_SEARCH&keywords=${keyword}`
  );
  console.log("data in getAllSymbols:", data)
  const result = data["bestMatches"].map((s) => {
    return {
      name: s["2. name"],
      symbol: s["1. symbol"],
    };
  });

  return result;
};
