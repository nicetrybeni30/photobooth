// Copies the current video frame onto a new canvas.
// The canvas is flipped horizontally so the photo matches the mirrored preview.
export function captureFrame(video) {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvas
}
