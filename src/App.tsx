import React, { useEffect, useState } from 'react'
import './App.css'
// @ts-ignore
import init from './univarse/demo3'

let instance:any = null

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      instance = init()
    },0)
  }, [])
  return (
    <div className="App" >
      <div id='progress'>

      </div>
      <div
        id="three"
        ref={(mount) => {
        }}
      />
      {/*<video autoPlay={true} loop={true} playsInline src="https://etlive-mediapackage-fastly.cbsaavideo.com/dvr/manifest.m3u8" />*/}
    </div>
  )
}

export default App
