import './CameraView.css'

// Shows the live camera. `children` is drawn on top of the video
// (used for the countdown overlay). `filterId` previews a photo filter live.
// `hidden` hides it without unmounting, so the camera keeps running between steps.
function CameraView({ videoRef, status, error, filterId = 'color', hidden = false, children }) {
  return (
    <div className="camera-view" hidden={hidden}>
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
