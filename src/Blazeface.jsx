import { useEffect, useState, useRef } from 'react'

import * as tfjs from '@tensorflow/tfjs-core'
// import '@tensorflow/tfjs-backend-wasm'
import '@tensorflow/tfjs-backend-cpu'
// import '@tensorflow/tfjs-backend-webgl'
import * as blazeface from '@tensorflow-models/blazeface'

import { calculateDistance } from './helpers/distanceCalculator'

import './App.css';



function App() {
  const close = useRef(null)
  const far = useRef(null)
  const videoFeed = useRef(null)
  const [model, setModel] = useState(null)
  const [mode, setMode] = useState('')
  const [distance, setDistance] = useState(null)
  const [fontSize, setFontSize] = useState('1em')



  const prep = async () => {
    await tfjs.ready()
    const modelLoad = await blazeface.load();
    setModel(modelLoad)
    setMode('ready')
  }
  const detect = async (imgRef) => {
    // // Load the model.
    // await tfjs.ready()
    // const model = await blazeface.load();
    // Pass in an image or video to the model. The model returns an array of
    // bounding boxes, probabilities, and landmarks, one for each detected face.

    const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
    const predictions = await model.estimateFaces(imgRef, returnTensors);

    if (predictions.length > 0 && predictions[0].probability[0] > 0.89) {
      const [left, right] = predictions[0].landmarks
      const ratio = 1920 / 400
      const calculatedIPD = Math.abs(left[0] - right[0]) / 1920 * 400
      const distance = calculateDistance(22, 400, calculatedIPD)
      console.log(predictions[0], distance)
      return setDistance(distance)
    } else {
      setDistance(null)
    }
  }

  useEffect(() => {
    prep()
  }, [])

  useEffect(() => {
    if (!videoFeed) {
      return
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        let video = videoFeed.current
        video.srcObject = stream
        video.play()
      })
  }, [videoFeed])

  useEffect(() => {
    if (mode === 'ready') {
      setInterval(() => detect(videoFeed.current), 1000)
    }
  }, [mode])

  useEffect(() => {
    if (distance < 550) {
      setMode("veryclose")
      setFontSize(`${1}em`)
    }
    else if (distance > 550 && distance < 900) {
      setMode("close")
      setFontSize(`${3}em`)
    }
    else if (distance > 900) {
      setMode("far")
      setFontSize(`${5}em`)
    }
    else {
      setMode("nobody")
    }
  }, [distance])

  return (
    <div className="App">
      {/* <h1>Distance!</h1> */}
      {mode === 'ready' || mode === 'nobody' && <h1>Ready!</h1>}
      {mode === 'veryclose' && <h1 style={{ fontSize }}>You're a pretty cool person!</h1>}
      {mode === 'close' && <h1 style={{ fontSize }}>Come closer!</h1>}
      {mode === 'far' && <h1 style={{ fontSize }}>Come here!</h1>}
      <video style={{ visibility: 'visible', position: 'absolute', left: 0, top: 0 }} width="400px" ref={videoFeed} autoPlay={true} muted={true}></video>
    </div>
  );
}

export default App;
