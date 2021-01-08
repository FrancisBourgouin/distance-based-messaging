import { useEffect, useState } from 'react'
import './App.css';
import FaceLandmarks from './FaceLandmarks';



function App() {
  const [mode, setMode] = useState("initial")
  const [setupValues, setSetupValues] = useState({
    close: 1000,
    far: 1300,
    fov: 0,
    stop: true
  })

  const setValue = (event) => {
    if (event.target.name === 'stop') {
      setSetupValues(prev => ({ ...prev, [event.target.name]: event.target.checked }))
    } else {
      setSetupValues(prev => ({ ...prev, [event.target.name]: Number(event.target.value) }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMode("active")
  }

  return (
    <div className="App">
      {mode === "initial" &&
        <form onSubmit={handleSubmit}>
          <section>
            <h1>Distance triggers (in mm)</h1>
            <p>
              <span>very close {"<"} </span>
              <input type="number" name="close" onChange={setValue} value={setupValues.close} />
              <span> {"<"} close {"<"} </span>
              <input type="number" name="far" onChange={setValue} value={setupValues.far} />
              <span> {"<"} far</span>
            </p>
          </section>
          <section>
            <h1>Field of view (in °)</h1>
            <p>0 to use the default (42.8°) (22mm lens on m4/3 body)</p>
            <p>90° for wide-angle (like Pixel 4)</p>
            <p>78° for 'standard' wide-angle (like Logitech C920)</p>
            <p>45° for square-ish webcams (like MacBooks)</p>
            <p>
              <input type="number" name="fov" onChange={setValue} value={setupValues.fov} />
            </p>
          </section>
          <section>
            <h1>Stop when at very close range</h1>
            <p>
              <input type="checkbox" name="stop" onChange={setValue} checked={setupValues.stop} />
            </p>
          </section>

          <button type="submit">Start demo</button>
        </form>
      }
      {mode === "active" && <FaceLandmarks {...{ close: setupValues.close, far: setupValues.far, fov: setupValues.fov, autoStop: setupValues.stop }} />}
    </div>
  );
}

export default App;
