import React, { useState, useEffect, useContext } from "react";
import { RingLoader } from "react-spinners";
import moment from "moment";
import { getHistoricalDataBySymbol } from "../../utils/WTDApi";

export default function Results({ formData }) {
  const [dataResults, setDataResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDataResults();
  }, [formData]);

  const initDataResults = async () => {
    const startDate = moment(formData.start).format().substring(0, 10);
    const allocations = formData.allocation;

    for (let i = 0; i < allocations.length; i++) {
      const allocBalance = formData.balance * (allocations[i].weight / 100);
      const symbol = allocations[i].symbol;
      const data = await getHistoricalDataBySymbol(symbol);
      const formattedData = formatData(startDate, data, allocBalance);

      if (formattedData) {
        const newDataResults = { ...dataResults };
        newDataResults[symbol] = {
          initialBalance: allocBalance.toFixed(2),
          initialDate: startDate,
          data: formatData,
        };
        setDataResults(newDataResults);
      } else {
        console.log("Something went wrong! Try again.");
      }
    }
    setLoading(false);
    console.log(dataResults);
  };

  const formatData = (startDate, data, allocBal) => {
    console.log(data);
    if (data["Time Series (Daily)"]) {
      const filteredData = Object.entries(data["Time Series (Daily)"])
        .filter(([key, _]) => key >= startDate)
        .reverse();

      const numShares = allocBal / filteredData[0][1]["4. close"];

      const result = filteredData.map((entry) => {
        return {
          date: entry[0],
          shares: numShares,
          close: entry[1]["4. close"],
          adjusted_close: entry[1]["5. adjusted close"],
          value_investment: numShares * entry[1]["4. close"],
        };
      });
      return result;
    }
    return null;
  };

  return (
    <div>
      {loading ? (
        <RingLoader color="#FFA500" loading={true} size={150} />
      ) : (
        <div>Results: {dataResults.length}</div>
      )}
    </div>
  );
}
