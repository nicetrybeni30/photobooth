import { useCallback, useState } from 'react'
import CameraView from './components/CameraView.jsx'
import Countdown from './components/Countdown.jsx'
import { useCamera } from './hooks/useCamera.js'
import { captureFrame } from './utils/capture.js'
import './App.css'

const PHOTO_COUNT = 4

function App() {
  const { videoRef, status, error } = useCamera()
  const [photos, setPhotos] = useState([]) // array of <canvas> elements
  const [isRunning, setIsRunning] = useState(false)

  // A session is active until we have all the photos. Derived, so no extra state to keep in sync.
  const sessionActive = isRunning && photos.length < PHOTO_COUNT

  function startSession() {
    setPhotos([])
    setIsRunning(true)
  }

  // useCallback keeps the same function between renders, so the Countdown's
  // effect doesn't restart its timer just because App re-rendered.
  const takePhoto = useCallback(() => {
    const frame = captureFrame(videoRef.current)
    setPhotos((prev) => [...prev, frame])
  }, [videoRef])

  return (
    <main className="app">
      <header className="app-header">
        <h1>Photobooth</h1>
        <p>Strike a pose. 4 photos, one strip.</p>
      </header>

      <section className="booth">
        <CameraView videoRef={videoRef} status={status} error={error}>
          {sessionActive && (
            <Countdown
              key={photos.length}
              label={`Photo ${photos.length + 1} of ${PHOTO_COUNT}`}
              onDone={takePhoto}
            />
          )}
        </CameraView>

        <div className="controls">
          <button
            className="btn btn-primary"
            onClick={startSession}
            disabled={status !== 'ready' || sessionActive}
          >
            {sessionActive ? 'Smile!' : 'Start'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
