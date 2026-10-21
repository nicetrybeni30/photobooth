import { useMemo } from 'react'
import './ShotSlots.css'

// The row of photo slots along the bottom of the screen, like the real booth.
// Empty slots show their number; taken photos show a thumbnail.
function ShotSlots({ photos, total }) {
  const thumbnails = useMemo(() => photos.map((p) => p.toDataURL('image/jpeg', 0.7)), [photos])

  return (
    <ol className="shot-slots">
      {Array.from({ length: total }, (_, i) => (
        <li key={i} className="shot-slot">
          {thumbnails[i] ? <img src={thumbnails[i]} alt={`Photo ${i + 1}`} /> : <span>{i + 1}</span>}
        </li>
      ))}
    </ol>
  )
}

export default ShotSlots
