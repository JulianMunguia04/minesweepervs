"use client"

import React from 'react'
import { useState, useEffect } from 'react';

const ads = () => {
  const [adCount, setAddCount] = useState(3)
  const [source, setSource] = useState(`/ads/1.PNG`)

  function getRandomNumber(adCount) {
    return Math.floor(Math.random() * adCount) + 1;
  }

  useEffect(() => {
    const number = getRandomNumber(adCount)
    setSource(`/ads/${number}.PNG`)
  },[])

  return(
    <>
      <img 
        className="position-fixed" 
        src={source} 
        style={{
          width:"9vw",
          top:"50%",
          transform:"translate(0%, -50%)",
          right: "1vw"
        }}></img>
    </>
  )
}

export default ads
