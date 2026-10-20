import CameraView from './components/CameraView.jsx'
import { useCamera } from './hooks/useCamera.js'
import './App.css'

function App() {
  const { videoRef, status, error } = useCamera()

  return (
    <main className="app">
      <header className="app-header">
        <h1>Photobooth</h1>
        <p>Strike a pose. 4 photos, one strip.</p>
      </header>

      <CameraView videoRef={videoRef} status={status} error={error} />
    </main>
  )
}

export default App
