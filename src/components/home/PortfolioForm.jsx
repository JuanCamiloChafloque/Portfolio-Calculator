import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { addDoc, doc, collection, serverTimestamp } from "@firebase/firestore";
import { db } from "../../firebase.js";
import { AuthContext } from "../../App.jsx";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/css/portfolioform.css";
import { stockInfo } from "../../data/stocks.js";

export const PortfolioForm = ({ setFormData }) => {
  const [queryresults, setQueryResults] = useState(null);
  const { user } = useContext(AuthContext);
  const [addStock, setAddstock] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [suggestedValues, setSuggestedValues] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const calendarRef = useRef(null);
  const [dataobj, setDataobj] = useState({
    balance: 0,
    start: "",
    finish: "",
    allocation: [],
  });

  // looks for suggested stock options
  const handleTicker = async (event) => {
    const value = event.target.value;
    setInputValue(value);

    const data = filterStocks(value);
    setSuggestedValues(data);
  };

  // toggle add more stocks input
  const addStockButton = () => {
    setAddstock(!addStock);
  };

const filterStocks = (input)=>{
if(input.toLowerCase()!==""){
  let filteredStocks = stockInfo.filter(stock=>{
    if(stock.symbol.toLowerCase().includes(input)||stock.name.toLowerCase().includes(input)){
      return true
    }else{
      return false
    }
  }
  )
  return (filteredStocks) 
}else{
  return []
}

}


  // adds and remove stock from the list
  const handleOptionToggle = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const CustomStartInput = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      id="datepick"
      className="buttons"
      onClick={onClick}
      ref={ref}
    >
      {value ? value : "Select a start date"}
    </button>
  ));

  const CustomFinishInput = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      id="datepick"
      className="buttons"
      onClick={onClick}
      ref={ref}
    >
      {value ? value : "Select a finish date"}
    </button>
  ));

  const getStartDate = () => {
    const today = new Date();
    return today.setDate(today.getDate() - 1);
  };

  const getFinishDate = () => {
    const today = new Date();
    return today.setDate(today.getDate());
  };

  const submitfunc = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    toast.success("Checking history and calculating portfolio.", {
      position: toast.POSITION.TOP_CENTER,
      theme: "colored",
    });
    setFormData({
      ...dataobj,
      start: new Date(dataobj.start).toISOString().substring(0, 10),
      finish: new Date(dataobj.finish).toISOString().substring(0, 10),
    });
  };

  const validateForm = () => {
    if (dataobj.balance === 0 || dataobj.balance === undefined) {
      toast.error("Please enter an initial balance.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return false;
    }

    if (dataobj.start === "") {
      toast.error("Please enter a start date.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return false;
    }

    if (dataobj.finish === "") {
      toast.error("Please enter an end date.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return false;
    }

    if (dataobj.allocation.length === 0) {
      toast.error(
        "Please enter at least one stock for the portfolio and its weight.",
        {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        }
      );
      return false;
    }

    if (dataobj.allocation.length > 5) {
      toast.error("Please enter at less than 5 stocks for the portfolio.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return false;
    }

    const sumValues = dataobj.allocation.reduce(
      (a, b) => parseInt(a) + parseInt(b.weight),
      0
    );

    if (sumValues !== 100) {
      toast.error("Weights in your allocations do not add up to 100%", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return false;
    }

    return true;
  };

  return (
    <form
      id="portfolioform"
      className="flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2"
      onSubmit={(e) => submitfunc(e)}
    >
      <input
        className="my-3 text-center"
        type="number"
        name=""
        id=""
        placeholder="Enter your starting balance"
        value={dataobj.balance}
        onChange={(event) =>
          setDataobj({
            ...dataobj,
            balance: parseFloat(event.target.value),
          })
        }
      />
      {/* <div className=" text-md flex justify-between w-80 items-center p-2">
        <span id="addstocks">Add stocks</span>
        <span onClick={addStockButton} id="plusbutton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-9 h-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </span>
      </div> */}
    {/* <form id='portfolioform' className='flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2' onSubmit={(e) => submitfunc(e)}>
      <input className='my-3 text-center' type="number" name="" id="" placeholder='Enter your starting balance' value={dataobj.balance} onChange={(event) => setDataobj({...dataobj, balance: parseInt(event.target.value)})} /> */}
    
      <ul>
        {selectedOptions.map((stock) => (
          <li
            className="flex justify-between font-medium  items-center max-h-96 w-80"
            key={stock}
          >
            <input
              type="checkbox"
              className="w-7 h-7"
              checked={selectedOptions.includes(stock)}
              onChange={() => handleOptionToggle(stock)}
              htmlFor={stock}
            />
            <label htmlFor={stock} className=" ">
              {stock}
            </label>
            <input
              type="number"
              className="percents w-10 h-7 text-base"
              htmlFor={stock}
              max="100"
              min="0"
              placeholder="0"
              onChange={(event) => {
                const newAllocation = dataobj.allocation.filter(
                  (item) => item.symbol !== stock
                );
                setDataobj({
                  ...dataobj,
                  allocation: [
                    ...newAllocation,
                    { symbol: stock, weight: parseFloat(event.target.value) },
                  ],
                });
              }}
            />
          </li>
        ))}
      </ul>
      {!addStock && (
        <input
          type="text"
          className="m-3"
          value={inputValue}
          onChange={handleTicker}
        />
      )}
      {inputValue.length !== 0 &&
        <ul className="max-h-96 w-80	overflow-y-scroll drop-shadow-md rounded-m p-2">
          {/* add a check box */}
            {suggestedValues.map((value, index) => (
              <li
                className=" bg-blue-50 text-m m-2 text-left p-1 rounded-md "
                key={index} 
              >
                <label className="flex justify-between font-medium items-center gradientText">
                  {value.symbol}
                  <input
                    type="checkbox"
                    className=" w-7 h-7"
                    checked={selectedOptions.includes(value.symbol)}
                    onChange={() => {
                      handleOptionToggle(value.symbol);
                      addStockButton();
                      setInputValue("");
                    }}
                  />
                </label>
              </li>
            ))}
        </ul>
      }
      <div className=' text-md flex justify-between w-80 items-center p-2'>
        <span id="addstocks" >Add stocks {selectedOptions.length}/5 </span>
        <span onClick={addStockButton} id='plusbutton'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </div>
      <ReactDatePicker
        className="w-10"
        selected={dataobj.start}
        onChange={(date) => setDataobj({ ...dataobj, start: date })}
        customInput={<CustomStartInput />}
        popperPlacement="bottom"
        maxDate={getStartDate()}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <ReactDatePicker
        className="w-10"
        selected={dataobj.finish}
        onChange={(date) => setDataobj({ ...dataobj, finish: date })}
        customInput={<CustomFinishInput />}
        popperPlacement="bottom"
        minDate={getFinishDate()}
        maxDate={getFinishDate()}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <input
        type="submit"
        value="Check History"
        className="buttons text-white"
      />
    </form>
  );
};
