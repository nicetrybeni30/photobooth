// Each filter is a 3x4 color matrix. For every pixel (r, g, b in 0..1):
//   newR = m[0]*r + m[1]*g + m[2]*b + m[3]
//   newG = m[4]*r + m[5]*g + m[6]*b + m[7]
//   newB = m[8]*r + m[9]*g + m[10]*b + m[11]
// The same matrix is used for the live preview (SVG feColorMatrix) and the
// saved photo (canvas pixels), so the two always match in every browser.

// Raises contrast around mid-grey: c > 1 means more contrast.
function withContrast(m, c) {
  const offset = 0.5 * (1 - c)
  return m.map((v, i) => (i % 4 === 3 ? v * c + offset : v * c))
}

const GREY = [0.2126, 0.7152, 0.0722, 0]

export const FILTERS = [
  { id: 'color', label: 'Color', matrix: null },
  { id: 'bw', label: 'B&W', matrix: withContrast([...GREY, ...GREY, ...GREY], 1.15) },
  {
    id: 'sepia',
    label: 'Sepia',
    matrix: [0.393, 0.769, 0.189, 0, 0.349, 0.686, 0.168, 0, 0.272, 0.534, 0.131, 0],
  },
  {
    id: 'warm',
    label: 'Warm',
    matrix: [1.1, 0.05, 0, 0.02, 0, 1.02, 0, 0.01, 0, 0, 0.85, 0],
  },
]

export function getFilter(id) {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0]
}

// The value for an SVG <feColorMatrix type="matrix">: 4 rows of 5 numbers (alpha row unchanged).
export function toSvgMatrix(m) {
  return [...m.slice(0, 4), 0, ...m.slice(4, 8), 0, ...m.slice(8, 12), 0, 0, 0, 0, 1, 0]
    .map((n) => (n === 0 ? '0' : n.toFixed(4)))
    .join(' ')
}

// Applies the matrix to every pixel of a canvas, in place.
export function applyMatrix(canvas, m) {
  if (!m) return
  const ctx = canvas.getContext('2d')
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const px = image.data // [r, g, b, a, r, g, b, a, ...] as 0..255
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i] / 255
    const g = px[i + 1] / 255
    const b = px[i + 2] / 255
    // Uint8ClampedArray clamps to 0..255 for us.
    px[i] = (m[0] * r + m[1] * g + m[2] * b + m[3]) * 255
    px[i + 1] = (m[4] * r + m[5] * g + m[6] * b + m[7]) * 255
    px[i + 2] = (m[8] * r + m[9] * g + m[10] * b + m[11]) * 255
  }
  ctx.putImageData(image, 0, 0)
}
