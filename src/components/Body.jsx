import React from 'react'
import LivePage from './LivePage'

const Body = () => {
    const apiKey = import.meta.env.VITE_API_KEY
    
  return (
      <LivePage apiKey={apiKey}/>
  )
}

export default Body
