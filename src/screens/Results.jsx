import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { useNavigate, useLocation } from "react-router-dom";
import ProfitsBoard from "../components/results/ProfitsBoard";
import { useMediaQuery } from 'react-responsive';
import "../assets/css/results.css";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const givendata = location.state.filteredRange;
  const [data, setData] = useState([]);
  const [piechartdata, setPieChartData] = useState([]);
  const [totalprofit, setTotalProfit] = useState(0.00);
  const isMobile = useMediaQuery({ query: `(max-width: 654px)` });

  useEffect(() => {
    const effectdata = [];
    for (const stockname in givendata) {
      if (Object.hasOwnProperty.call(givendata, stockname)) {
        const stockData = givendata[stockname].data.map((entry) => {
          const splitDate = entry.date.split("-");

          // if the date already exists in the data array, add the new stock's value to the existing date
          // else, add a new date to the data array
          const date = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;
          const existingIndex = effectdata.findIndex(
            (obj) => obj.date === date
          );
          if (existingIndex !== -1) {
            effectdata[existingIndex][stockname] = parseFloat(
              (
                Math.round(
                  givendata[stockname].sharesondayone * entry.close * 100
                ) / 100
              ).toFixed(2)
            );
            return;
          }
          return {
            // convert from YYYY-MM-DD to MM-DD-YYYY
            date: `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`,

            // round to 2 decimal places and include extra 0s if needed to represent cents
            [stockname]: parseFloat(
              (
                Math.round(
                  givendata[stockname].sharesondayone * entry.close * 100
                ) / 100
              ).toFixed(2)
            ),
          };
        });
        
        effectdata.push(...stockData.filter((val) => val !== undefined));
      }
    }
    
    // iterate through the effectdata, and if there is no value for any of the stocks at that date,
    // just add the key as the stockname, and the value as 0
    for (let i = 0; i < effectdata.length; i++) {
      const element = effectdata[i];
      for (const stockname in givendata) {
        if (Object.hasOwnProperty.call(givendata, stockname)) {
          if (!element[stockname]) {
            element[stockname] = 0;
          }
        }
      }
    }
    
    setTotalProfit(getTotalProfit());
    setPieChartData(getPieChartData());
    setData(effectdata);
  }, []);

  const getPieChartData = () => {
    const chartdata = [];
    Object.entries(givendata).forEach(([key, val]) => {
      const obj = {
        name: key,
        value: val.weight,
      };
      chartdata.push(obj);
    });

    return chartdata;
  };

  const getTotalProfit = () => {
    let totalProfit = 0.0;
    Object.entries(givendata).forEach(([key, val]) => {
      totalProfit += (Math.round(val.sharesondayone * val.data.slice(-1)[0].close * 100) / 100);
    });
    
    return totalProfit.toFixed(2);
  };

  // math stuff for pie chart
  const RADIAN = Math.PI / 180;

  return (
    <div id="resultsouterdiv" className="mt-4 w-full">
      <div className="toprightbuttons">
        <button
          id="pastsearchesbutton"
          className="buttons"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
      <h1 className="text-white">Results</h1>
      {totalprofit !== 0.00 && 
        <h1 className="text-3xl my-4 bg-blue-50 shadow-md rounded-lg px-6 pt-5 py-3">Total Profit: &nbsp;
          <span style={{color: parseFloat(totalprofit) >= 0 ? 'green' : 'red'}}>
          ${parseFloat(totalprofit).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          </span>
        </h1>
      }
      <div id="profitandchartdiv" className="flex flex-row justify-between items-center w-full my-4 gap-x-4">
        <ProfitsBoard data={givendata} />
        <div id="chartdiv" className="bg-blue-50 shadow-md rounded-lg py-4">
          {piechartdata.length > 0 && (
            <PieChart width={225} height={225}>
              <Pie
                data={piechartdata}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={45}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="middle">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {piechartdata.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${Math.random() * 360}, 50%, 60%)`}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          )}
        </div>
      </div>
      {Object.keys(data).length > 0 && (
        isMobile ? (
          <ResponsiveContainer width="140%" height="15%">
            <LineChart
              width={700}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 50,
                left: 40,
                bottom: 5,
              }}
              className="bg-blue-50 shadow-md rounded-lg"
            >
              <XAxis dataKey="date" tick={{ fill: 'black' }} />
              <YAxis tick={{ fill: 'black' }}>
              <Label
                value="Prices"
                position="insideLeft"
                angle={0}
                style={{ textAnchor: 'middle', fill: 'black' }}
                offset={-10}
              />
              </YAxis>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend height={24} />
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
        ) : (
          <LineChart
            width={700}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 50,
              left: 40,
              bottom: 5,
            }}
            className="bg-blue-50 shadow-md rounded-lg"
          >
            <XAxis dataKey="date" tick={{ fill: 'black' }} />
            <YAxis tick={{ fill: 'black' }}>
            <Label
              value="Prices"
              position="insideLeft"
              angle={0}
              style={{ textAnchor: 'middle', fill: 'black' }}
              offset={-10}
            />
            </YAxis>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend height={24} />
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
        )
      )}
    </div>
  );
}
