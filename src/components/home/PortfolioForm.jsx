import React, { useState, useEffect, useContext } from 'react';
import { addDoc, doc, collection, serverTimestamp } from '@firebase/firestore';
import { db } from '../../firebase.js';
import { AuthContext } from '../../App.jsx';
import {getAllSymbols} from '../../utils/WTDApi.js'
import '../../assets/css/portfolioform.css'

export const PortfolioForm = () => {
  const [queryresults, setQueryResults] = useState(null);
  const {user} = useContext(AuthContext);
  const [addStock, setAddstock]=useState(true)
  const [inputValue, setInputValue] = useState('');
  const [suggestedValues, setSuggestedValues] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // looks for suggested stock options
  const handleTicker = async(event)=>{
    const value = event.target.value
    setInputValue(value);

    const data = await getAllSymbols(value)
    setSuggestedValues(data)
    
  }
  // toggle add more stocks input
  const addStockButton=()=>{
    setAddstock(!addStock)
  }

  // adds and remove stock from the list
  const handleOptionToggle = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <form id='portfolioform' className='flex items-center mx-auto flex-col w-max-2 justify-start rounded-lg p-2'> 
      <input className='my-3' type="number" name="" id="" />
      <div className=' text-md flex justify-between w-80 items-center p-2'>
        <span>Add stocks</span>
        <span onClick={addStockButton} id='plusbutton'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-9 h-9">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </div>
      <ul>
        {selectedOptions.map((stock)=> 
          <li className='flex justify-between font-medium  items-center max-h-96 w-80' key={stock}> 
            <input type="checkbox" className="w-7 h-7" checked={selectedOptions.includes(stock)} onChange={() => handleOptionToggle(stock)} 
              htmlFor={stock}
            /> 
            <label htmlFor={stock} className=' '>{stock}</label>  
            <input type="number" className="percents w-10 h-7 text-base" htmlFor={stock} max='100' />
          </li>
        )}
      </ul>
      {!addStock && <input type="text" className='mb-3' value={inputValue} onChange={handleTicker} />}  
      <ul className="max-h-96 w-80	overflow-y-scroll  bg-purple-400 rounded-sm ">
        {/* add a check box */}
        {inputValue.length !== 0 &&
          suggestedValues.map((value, index) => 
            <li className='text-purple-600 bg-slate-200 text-m m-1 text-left p-1 ' key={index}>
              <label className='flex justify-between font-medium items-center'>
                {value.symbol}
                <input type="checkbox" className=' w-7 h-7' checked={selectedOptions.includes(value.symbol)}
                  onChange={() => {handleOptionToggle(value.symbol)
                    addStockButton()
                    setInputValue("")
                  }}
                />
              </label>
            </li>
        )}
      </ul>
    </form>
  )
}