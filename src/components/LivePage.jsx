import React, { useRef, useState } from 'react';
import  useLivePrices  from './useLivePrices';

export default function LivePage({ apiKey }) {
  const [symbols,setSymbols] = useState(['BTC/USD'])
  const { prices, status } = useLivePrices(symbols, apiKey);
 
  const inputRef = useRef(null)
    

    const handleSubmit = (e) => {
        if(e.key=='Enter'){
            e.preventDefault()
              const value = inputRef.current.value.trim();
            setSymbols(prev=>[...prev,value])
            inputRef.current.value = '';
        }
    }
  return (
    <div className='flex justify-center items-center h-screen'>
    <div className='border w-100 flex flex-col'>  
        <label className='font-medium m-2 p-2'>
            Enter the stock
        <input className='border p-1' type='text' ref={inputRef} onKeyDown={handleSubmit}/>
        </label> 
      {symbols.map(symbol => {
        const data = prices[symbol];
        const onlineStatus = status[symbol]
        return (
          <div key={symbol} className='p-1 flex justify-between'>
            <div>
            {onlineStatus==undefined?'⚪️':onlineStatus=='pass'?'🟢':'🔴'}
            <span>{symbol}</span></div>
            <div> {data ? data.price : onlineStatus=='fail'?'fail':'...'}
                </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}