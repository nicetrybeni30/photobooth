import './CameraView.css'

// Shows the live camera. `children` is drawn on top of the video
// (used for the countdown overlay). `filterId` previews a photo filter live.
function CameraView({ videoRef, status, error, filterId = 'color', children }) {
  return (
    <div className="camera-view">
      {/* The <video> is always rendered so videoRef points at it before the camera starts. */}
      <video
        ref={videoRef}
        className="camera-video"
        hidden={status === 'error'}
        style={{ filter: filterId === 'color' ? 'none' : `url(#filter-${filterId})` }}
        autoPlay
        playsInline
        muted
      />

      {status === 'loading' && <p className="camera-message">Starting camera…</p>}

      {status === 'error' && (
        <div className="camera-message camera-error" role="alert">
          <strong>📷 Camera unavailable</strong>
          <p>{error}</p>
        </div>
      )}

      {children}
    </div>
  )
}

export default CameraView
