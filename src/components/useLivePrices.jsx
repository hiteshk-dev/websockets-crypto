import React, { useCallback, useEffect, useState, useRef } from 'react'

const useLivePrices = (symbols = [],apiKey) => {
    const [prices, setPrices] = useState({})
     const [status, setStatus] = useState({})
    const webRef = useRef(null)

    const sendMessage = useCallback((message) => {
        if(webRef.current && webRef.current.readyState == WebSocket.OPEN){
            webRef.current.send(JSON.stringify(message))
        }
    },[])
    console.log('Rerendering')

    useEffect(() => {
         const url = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`;
        const ws = new WebSocket(url)
        webRef.current = ws

        ws.onopen = () => {
            sendMessage({
                action: 'subscribe',
                params: {
                    symbols: symbols.join(',')
                }
            })
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.event == 'price') {
                setPrices(prev => ({
                    ...prev,
                    [data.symbol]: data
                }))
            }
            else if(data.event == 'subscribe-status'){
                const failedData = data.fails ? data.fails : []
                const completeStatus = [...failedData,...data.success]
                const completeResult =  completeStatus.reduce((acc,curr)=>{
                    if(curr.exchange){
                        acc[curr.symbol] = 'pass'
                    }
                    else{
                        acc[curr.symbol] = 'fail'
                    }
                    return acc
                },{})
                setStatus(completeResult)
            }
        }

        ws.onclose = (event) => {
            console.log('WebSocket closed', event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error', error);
        };
        return () => {
            if (webRef.current) {
                sendMessage({
                    action: 'unsubscribe',
                    params: {
                        symbols: symbols.join(',')
                    }
                })
            }
        }
    }, [apiKey,sendMessage,symbols])

  return { prices, sendMessage, status };
}

export default useLivePrices
