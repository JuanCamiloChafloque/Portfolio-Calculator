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
  const [data, setData] = useState([]);
  console.log("givendata: ", givendata)

  useEffect(() => {
    const data = [];
    for (const stockname in givendata) {
      if (Object.hasOwnProperty.call(givendata, stockname)) {
        const stockData = givendata[stockname].data.map((entry) => {
          const splitDate = entry.date.split("-");
          return {
            // convert from YYYY-MM-DD to MM-DD-YYYY
            date: `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`,
            // round to 2 decimal places and include extra 0s if needed to represent cents
            [stockname]: (Math.round(givendata[stockname].sharesondayone * entry.close * 100) / 100).toFixed(2),
          };
        });
        data.push(...stockData);
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
      {data.length > 0 && (
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
                .filter((key) => key !== 'date') // Exclude the 'name' property from rendering as a line
                .map((key, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={key}
                    stroke={`hsl(${Math.random() * 360}, 50%, 60%)`} // Generate a random stroke color
                    activeDot={{ r: 8 }}
                  />
                ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}