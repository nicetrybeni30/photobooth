import { useMemo } from 'react'
import { buildStrip } from '../utils/strip.js'
import './PhotoStrip.css'

// Builds the strip from the photos and shows a preview of it.
function PhotoStrip({ photos }) {
  // useMemo: only redraw the strip when `photos` changes, not on every render.
  const strip = useMemo(() => buildStrip(photos), [photos])
  const previewUrl = useMemo(() => strip.toDataURL('image/png'), [strip])

  return (
    <div className="photo-strip">
      <img className="photo-strip-image" src={previewUrl} alt="Your photo strip" />
    </div>
  )
}

export default PhotoStrip
