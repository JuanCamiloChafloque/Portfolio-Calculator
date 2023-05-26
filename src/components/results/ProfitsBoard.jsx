import React from "react";

const ProfitsBoard = ({ data }) => {
  return (
    <div>
      {Object.entries(data).map(([key, value]) => {
        return (
          <div key={key}>
            <h1>Allocation: {key}</h1>
            <h5>Number of shares: {value.sharesondayone}</h5>
            <h5>
              Today's Profit: {`$${(Math.round(value.sharesondayone * value.data.slice(-1)[0].close * 100) / 100).toFixed(2)}`}
            </h5>
          </div>
        );
    })}
    </div>
  );
};

export default ProfitsBoard;