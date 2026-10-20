import { applyMatrix } from './filters.js'

const ASPECT = 4 / 3 // classic photobooth frame; CameraView crops the preview the same way

// Copies the current video frame onto a new canvas: center-cropped to 4:3,
// flipped horizontally to match the mirrored preview, with the filter applied.
export function captureFrame(video, matrix) {
  const vw = video.videoWidth
  const vh = video.videoHeight

  // The biggest 4:3 rectangle in the middle of the video.
  let sw = vw
  let sh = vh
  if (vw / vh > ASPECT) sw = vh * ASPECT
  else sh = vw / ASPECT
  const sx = (vw - sw) / 2
  const sy = (vh - sh) / 2

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(sw)
  canvas.height = Math.round(sh)

  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

  applyMatrix(canvas, matrix)
  return canvas
}
