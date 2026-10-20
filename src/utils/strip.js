const STRIP_WIDTH = 600
const PADDING = 36 // paper border around the photos
const GAP = 18 // paper between photos
const FOOTER_HEIGHT = 150

// Draws the photos stacked vertically on one canvas in the chosen paper color,
// with a footer showing the booth name and today's date. Returns the canvas.
export function buildStrip(photos, paper, date = new Date()) {
  const photoWidth = STRIP_WIDTH - PADDING * 2
  // All photos come from the same camera, so they share one aspect ratio.
  const photoHeight = Math.round(photoWidth * (photos[0].height / photos[0].width))

  const canvas = document.createElement('canvas')
  canvas.width = STRIP_WIDTH
  canvas.height =
    PADDING + photos.length * photoHeight + (photos.length - 1) * GAP + FOOTER_HEIGHT

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = paper.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  photos.forEach((photo, i) => {
    const y = PADDING + i * (photoHeight + GAP)
    ctx.drawImage(photo, PADDING, y, photoWidth, photoHeight)
  })

  const footerTop = canvas.height - FOOTER_HEIGHT
  const centerX = canvas.width / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // The fonts are loaded in index.html; if one isn't ready yet, the fallback is used.
  ctx.fillStyle = paper.ink
  ctx.font = '64px "Great Vibes", cursive'
  ctx.fillText('Photobooth', centerX, footerTop + FOOTER_HEIGHT * 0.45)

  ctx.fillStyle = paper.subInk
  ctx.font = '600 20px "Cormorant Garamond", Georgia, serif'
  const dateText = date
    .toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    .toUpperCase()
  ctx.fillText(dateText, centerX, footerTop + FOOTER_HEIGHT * 0.78)

  return canvas
}
