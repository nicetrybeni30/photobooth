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
    // Free the memory the blob URL holds. Wait a moment: Safari can cancel the download if it's revoked right away.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// Builds the strip from the photos and shows a preview of it.
function PhotoStrip({ photos, onRetake }) {
  // useMemo: only redraw the strip when `photos` changes, not on every render.
  const strip = useMemo(() => buildStrip(photos), [photos])
  const previewUrl = useMemo(() => strip.toDataURL('image/png'), [strip])

  function handleDownload() {
    // Local date as YYYY-MM-DD (toISOString would give the UTC date, which can be a day off).
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    downloadCanvas(strip, `photobooth-${today}.png`)
  }

  return (
    <div className="photo-strip">
      <img className="photo-strip-image" src={previewUrl} alt="Your photo strip" />
      <div className="photo-strip-actions">
        <button className="btn btn-primary" onClick={handleDownload}>
          Download PNG
        </button>
        <button className="btn" onClick={onRetake}>
          Retake
        </button>
      </div>
    </div>
  )
}

export default PhotoStrip
