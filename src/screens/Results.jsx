import React, { useState, useEffect, useContext, PureComponent } from "react";
import { RingLoader } from "react-spinners";
import moment from "moment";
import { getHistoricalDataBySymbol } from "../utils/WTDApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../assets/css/results.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location.state: ", location.state)
  const givendata = location.state.filteredRange;
  const [data, setData] = useState({});
  console.log("givendata: ", givendata)

  useEffect(() => {
    const data = [];
    for (const stockname in givendata) {
      if (Object.hasOwnProperty.call(givendata, stockname)) {
        const stockData = givendata[stockname].data.map((entry) => {
          const splitDate = entry.date.split("-");
          // if the date already exists in the data array, add the new stock's value to the existing date
          // else, add a new date to the data array
          const date = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;
          const existingIndex = data.findIndex((obj) => obj.date === date);

          if (existingIndex !== -1) {
            data[existingIndex][stockname] = parseFloat((Math.round(givendata[stockname].sharesondayone * entry.close * 100) / 100).toFixed(2));
            return;
          }
          return {
            // convert from YYYY-MM-DD to MM-DD-YYYY
            date: `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`,
            // round to 2 decimal places and include extra 0s if needed to represent cents
            [stockname]: parseFloat((Math.round(givendata[stockname].sharesondayone * entry.close * 100) / 100).toFixed(2)),
          };
        });
        // filter stockdata since it may contain undefined values
        // data.push(...stockData);
        data.push(...stockData.filter((val) => val !== undefined));
      }
    }
    console.log("data: ", data)
    setData(data);
  }, []);

  useEffect(() => {
    console.log("data just set to: ", data);
  }, [data]);

  return (
    <div id="resultsouterdiv">
      <div className="toprightbuttons">
        <button id="pastsearchesbutton" className="buttons" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
      <h1>Results</h1>
      {Object.keys(data).length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend height={36} />
              {/* Render Line components for each stock dynamically */}
              {Object.keys(data[0])
                .filter((key) => key !== 'date')
                .map((entry, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={entry}
                    stroke={`hsl(${Math.random() * 360}, 50%, 60%)`}
                    activeDot={{ r: 8 }}
                  />
              ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}