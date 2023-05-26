import axios from "axios";

// pranav's api key
// const API_KEY = "SV2RAVRTE4ZMY20U";
// nathanuel's api key
const API_KEY = "58ITJOGTSMQ4HAXP";
const BASE_URL = "https://www.alphavantage.co/query?apikey=" + API_KEY;

export const getHistoricalDataBySymbol = async (symbol) => {
  const { data } = await axios.get(
    BASE_URL +
      `&function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${symbol}`
  );

  console.log("data is:", data);
  
  // if data is an object, return that object, if else return an empty object
  // if the object has a key named "Time Series (Daily)", return that object, if else return an empty object
  if (data.hasOwnProperty("Time Series (Daily)")) {
    return data["Time Series (Daily)"];
  } else {
    return data;
  }
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
