import { useCallback, useEffect, useMemo, useState } from 'react'
import CameraView from './components/CameraView.jsx'
import ChoicePicker from './components/ChoicePicker.jsx'
import Countdown from './components/Countdown.jsx'
import FilterDefs from './components/FilterDefs.jsx'
import PrintTray from './components/PrintTray.jsx'
import ShotSlots from './components/ShotSlots.jsx'
import StepPlate from './components/StepPlate.jsx'
import { useCamera } from './hooks/useCamera.js'
import { captureFrame } from './utils/capture.js'
import { downloadCanvas, localDateStamp } from './utils/download.js'
import { FILTERS, getFilter } from './utils/filters.js'
import { PAPERS, getPaper } from './utils/papers.js'
import { buildStrip } from './utils/strip.js'
import './App.css'

const PHOTO_COUNT = 4
const STEPS = ['filter', 'shoot', 'paper', 'print']

const filterSwatch = (f) => ({
  background: 'linear-gradient(135deg, #e8546b, #f6c35c 50%, #4fa6d8)',
  filter: f.matrix ? `url(#filter-${f.id})` : 'none',
})
const paperSwatch = (p) => ({ background: p.bg })

function App() {
  const { videoRef, status, error } = useCamera()
  const [step, setStep] = useState('filter')
  const [filterId, setFilterId] = useState('bw')
  const [paperId, setPaperId] = useState('white')
  const [photos, setPhotos] = useState([]) // array of <canvas> elements
  const [flashes, setFlashes] = useState(0) // bumps on every shot to replay the flash

  const shooting = step === 'shoot' && photos.length < PHOTO_COUNT

  // The strip is rebuilt whenever the photos or the paper color change.
  const strip = useMemo(
    () => (photos.length === PHOTO_COUNT ? buildStrip(photos, getPaper(paperId)) : null),
    [photos, paperId],
  )
  const stripUrl = useMemo(() => strip?.toDataURL('image/png'), [strip])

  // After the last photo, wait a moment (so you see the 4th slot fill), then go to paper.
  useEffect(() => {
    if (step !== 'shoot' || photos.length < PHOTO_COUNT) return
    const id = setTimeout(() => setStep('paper'), 900)
    return () => clearTimeout(id)
  }, [step, photos.length])

  function startShooting() {
    setPhotos([])
    setStep('shoot')
  }

  function retake() {
    setPhotos([])
    setStep('filter')
  }

  // useCallback keeps the same function while the countdown runs, so its timer isn't restarted.
  const takePhoto = useCallback(() => {
    const frame = captureFrame(videoRef.current, getFilter(filterId).matrix)
    setPhotos((prev) => [...prev, frame])
    setFlashes((n) => n + 1)
  }, [videoRef, filterId])

  function download() {
    downloadCanvas(strip, `photobooth-${localDateStamp()}.png`)
  }

  const showCamera = step === 'filter' || step === 'shoot'

  return (
    <div className="scene">
      <FilterDefs />
      <main className="booth">
        <section className="booth-panel">
          <div className="lens" aria-hidden="true" />
          <StepPlate current={STEPS.indexOf(step)} />

          <div className="screen-bezel">
            <div className="screen">
              <CameraView
                videoRef={videoRef}
                status={status}
                error={error}
                filterId={filterId}
                hidden={!showCamera}
              >
                {flashes > 0 && step === 'shoot' && <div key={flashes} className="flash" />}

                {step === 'filter' && status === 'ready' && (
                  <div className="screen-bar">
                    <h2 className="screen-title">Choose a filter</h2>
                    <ChoicePicker
                      label="Filter"
                      options={FILTERS}
                      value={filterId}
                      onChange={setFilterId}
                      swatchStyle={filterSwatch}
                    />
                    <button className="btn btn-primary" onClick={startShooting}>
                      Start
                    </button>
                  </div>
                )}

                {step === 'shoot' && (
                  <>
                    {shooting && (
                      <Countdown
                        key={photos.length}
                        label={`Photo ${photos.length + 1} of ${PHOTO_COUNT}`}
                        onDone={takePhoto}
                      />
                    )}
                    <div className="screen-bottom">
                      <ShotSlots photos={photos} total={PHOTO_COUNT} />
                    </div>
                  </>
                )}
              </CameraView>

              {step === 'paper' && (
                <div className="screen-panel">
                  <img className="strip-preview" src={stripUrl} alt="Photo strip preview" />
                  <div className="screen-panel-controls">
                    <h2 className="screen-title">Pick your paper</h2>
                    <ChoicePicker
                      label="Paper color"
                      options={PAPERS}
                      value={paperId}
                      onChange={setPaperId}
                      swatchStyle={paperSwatch}
                    />
                    <div className="screen-actions">
                      <button className="btn btn-primary" onClick={() => setStep('print')}>
                        Print
                      </button>
                      <button className="btn" onClick={retake}>
                        Retake
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'print' && (
                <div className="screen-panel screen-panel-center">
                  <div className="screen-panel-controls">
                    <h2 className="screen-title big">Grab your print!</h2>
                    <p className="screen-note">Your strip is coming out of the print slot.</p>
                    <div className="screen-actions">
                      <button className="btn btn-primary" onClick={download}>
                        Download PNG
                      </button>
                      <button className="btn" onClick={retake}>
                        Retake
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <PrintTray stripUrl={stripUrl} printed={step === 'print'} />
      </main>
    </div>
  )
}

export default App
