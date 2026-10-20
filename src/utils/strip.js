const STRIP_WIDTH = 600
const PADDING = 30 // white border around the photos
const GAP = 20 // white space between photos
const FOOTER_HEIGHT = 90

// Draws the photos stacked vertically on one white canvas,
// with a footer showing today's date. Returns the canvas.
export function buildStrip(photos, date = new Date()) {
  const photoWidth = STRIP_WIDTH - PADDING * 2
  // All photos come from the same camera, so they share one aspect ratio.
  const photoHeight = Math.round(photoWidth * (photos[0].height / photos[0].width))

  const canvas = document.createElement('canvas')
  canvas.width = STRIP_WIDTH
  canvas.height =
    PADDING + photos.length * photoHeight + (photos.length - 1) * GAP + FOOTER_HEIGHT

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  photos.forEach((photo, i) => {
    const y = PADDING + i * (photoHeight + GAP)
    ctx.drawImage(photo, PADDING, y, photoWidth, photoHeight)
  })

  const footerTop = canvas.height - FOOTER_HEIGHT
  const centerX = canvas.width / 2
  ctx.fillStyle = '#2b2730'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '600 26px system-ui, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('Photobooth', centerX, footerTop + FOOTER_HEIGHT * 0.42)
  ctx.fillStyle = '#6b6375'
  ctx.font = '18px system-ui, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(
    date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    centerX,
    footerTop + FOOTER_HEIGHT * 0.72,
  )

  return canvas
}
