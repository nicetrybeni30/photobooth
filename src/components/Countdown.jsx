import { useEffect, useState } from 'react'
import './Countdown.css'

// Counts down from `from` to 1 (one step per second), then calls onDone().
// The parent gives it a new `key` for every photo, so the count starts fresh each time.
function Countdown({ from = 3, label, onDone }) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    const id = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        onDone()
      }
    }, 1000)

    // Cleanup: cancel the pending timer if the component unmounts
    // (or before this effect runs again for the next number).
    return () => clearTimeout(id)
  }, [count, onDone])

  return (
    <div className="countdown" aria-live="assertive">
      {/* key={count} remounts the number so the CSS pop animation replays each second. */}
      <span key={count} className="countdown-number">{count}</span>
      {label && <span className="countdown-label">{label}</span>}
    </div>
  )
}

export default Countdown
