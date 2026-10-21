import './PrintTray.css'

// The print slot on the side of the booth. When `printed` is true the strip
// slides out of the slot; before that the tray is empty.
function PrintTray({ stripUrl, printed }) {
  return (
    <aside className="print-tray" aria-label="Print tray">
      <div className="print-slot">
        <span className="print-slot-label">Prints</span>
        <span className="print-slot-opening" />
      </div>
      <div className="print-output">
        {printed && stripUrl ? (
          <img className="print-strip" src={stripUrl} alt="Your printed photo strip" />
        ) : (
          <p className="print-empty">Your print comes out here</p>
        )}
      </div>
    </aside>
  )
}

export default PrintTray
