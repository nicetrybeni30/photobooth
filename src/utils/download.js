// Saves a canvas as a PNG file through a temporary download link.
export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    // Free the memory the blob URL holds. Wait a moment: Safari can cancel the download if it's revoked right away.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// Local date as YYYY-MM-DD (toISOString would give the UTC date, which can be a day off).
export function localDateStamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
