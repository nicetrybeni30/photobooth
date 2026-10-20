import { useEffect, useRef, useState } from 'react'

// Turns a getUserMedia error into a message a person can act on.
function friendlyError(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera permission was denied. Allow camera access in your browser (the icon in the address bar) and reload the page.'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No camera was found. Plug in a webcam, or start Chrome with a fake camera (see the README).'
    case 'NotReadableError':
      return 'Your camera is being used by another app. Close it and reload the page.'
    default:
      return 'Could not start the camera. Please reload the page and try again.'
  }
}

// Starts the webcam when the component using this hook mounts,
// and stops it when that component unmounts.
export function useCamera() {
  const videoRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')

  useEffect(() => {
    const video = videoRef.current
    let stream = null
    let cancelled = false

    async function start() {
      // mediaDevices is undefined on insecure origins (plain http that isn't localhost).
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('This browser can only use the camera on localhost or an https:// page.')
        setStatus('error')
        return
      }

      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        // The component unmounted while we were waiting for permission.
        if (cancelled) {
          s.getTracks().forEach((track) => track.stop())
          return
        }
        stream = s
        video.srcObject = stream
        await video.play().catch(() => {})
        if (!cancelled) setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setError(friendlyError(err))
        setStatus('error')
      }
    }

    start()

    // Cleanup: runs when the component unmounts.
    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
      video.srcObject = null
    }
  }, [])

  return { videoRef, status, error }
}
