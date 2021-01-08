import { useEffect, useState, useRef } from 'react'

import * as tfjs from '@tensorflow/tfjs-core'
// import '@tensorflow/tfjs-backend-wasm'
// import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
// import * as blazeface from '@tensorflow-models/blazeface'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import { calculateDistance } from './helpers/distanceCalculator'

import './App.css';



function FaceLandmarks(props) {
  const { close, far, fov, autoStop } = props

  const videoFeed = useRef(null)
  const [model, setModel] = useState(null)
  const [mode, setMode] = useState('')
  const [distance, setDistance] = useState(null)
  const [fontSize, setFontSize] = useState('1em')
  const [scanning, setScanning] = useState(null)


  const prep = async () => {
    await tfjs.ready()
    const modelLoad = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    setModel(modelLoad)
  }

  const detect = async (imgRef) => {
    // // Load the model.
    // await tfjs.ready()
    // const model = await blazeface.load();

    // Pass in an image or video to the model. The model returns an array of
    // bounding boxes, probabilities, and landmarks, one for each detected face.

    const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
    const predictions = await model.estimateFaces({
      input: imgRef
    });

    if (predictions.length > 0 && predictions[0].faceInViewConfidence > 0.89) {
      const left = predictions[0].annotations.leftEyeIris[0]
      const right = predictions[0].annotations.rightEyeIris[0]

      const distancePX = ((right[0] - left[0]) ** 2 + (right[1] - left[1]) ** 2 + (right[2] - left[2]) ** 2) ** (1 / 2)
      const ratio = 1920 / 400
      const calculatedIPD = Math.abs(distancePX) / 1920 * 400
      const distance = calculateDistance(22, 400, calculatedIPD, fov)
      console.log(predictions[0], distance)
      setDistance(distance)
    } else {
      setDistance(null)
    }
    // requestAnimationFrame(() => detect(imgRef))


  }

  useEffect(() => {
    prep()
  }, [])

  useEffect(() => {
    if (model && videoFeed) {
      // model.estimateFaces({
      //   input: videoFeed.current
      // });
      setMode('ready')
    }

  }, [model])

  useEffect(() => {
    if (!videoFeed) {
      return
    }
    navigator
      .mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        videoFeed.current.srcObject = stream
      })
  }, [])

  useEffect(() => {
    if (mode === 'ready') {
      // detect(videoFeed.current)
      setScanning(setInterval(() => detect(videoFeed.current), 1000))
    }
    if (mode === 'veryclose' && autoStop) {
      clearInterval(scanning)
      console.log('stopped')
    }
  }, [mode])

  useEffect(() => {
    if (distance === null) {
      // setMode("nobody")
      return
    }
    else if (distance < close) {
      setMode("veryclose")
      setFontSize(`${1}em`)
    }
    else if (distance > close && distance < far) {
      setMode("close")
      setFontSize(`${3}em`)
    }
    else if (distance > far) {
      setMode("far")
      setFontSize(`${5}em`)
    }
  }, [distance])

  return (
    <div className="FaceLandmarks">
      {/* <h1>Distance!</h1> */}
      <video style={{ visibility: 'visible', position: 'absolute', left: 0, top: 0 }} width="400px" ref={videoFeed} autoPlay={true} muted={true}></video>
      {(mode === 'ready' || mode === 'nobody') && <h1>Ready!</h1>}
      {mode === 'veryclose' && <h1 style={{ fontSize }}>You're a pretty cool person!</h1>}
      {mode === 'close' && <h1 style={{ fontSize }}>Come closer!</h1>}
      {mode === 'far' && <h1 style={{ fontSize }}>Come here!</h1>}
    </div>
  );
}

export default FaceLandmarks;
