import { useMemo } from 'react'
import { buildStrip } from '../utils/strip.js'
import './PhotoStrip.css'

// Saves a canvas as a PNG file through a temporary download link.
function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url) // free the memory the blob URL was holding
  }, 'image/png')
}

// Builds the strip from the photos and shows a preview of it.
function PhotoStrip({ photos }) {
  // useMemo: only redraw the strip when `photos` changes, not on every render.
  const strip = useMemo(() => buildStrip(photos), [photos])
  const previewUrl = useMemo(() => strip.toDataURL('image/png'), [strip])

  function handleDownload() {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    downloadCanvas(strip, `photobooth-${today}.png`)
  }

  return (
    <div className="photo-strip">
      <img className="photo-strip-image" src={previewUrl} alt="Your photo strip" />
      <div className="photo-strip-actions">
        <button className="btn btn-primary" onClick={handleDownload}>
          Download PNG
        </button>
      </div>
    </div>
  )
}

export default PhotoStrip
