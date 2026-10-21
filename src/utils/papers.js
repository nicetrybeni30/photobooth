// Paper colors for the printed strip. `ink` is the main footer text, `subInk` the date.
export const PAPERS = [
  { id: 'white', label: 'White', bg: '#ffffff', ink: '#1f1b1c', subInk: '#6b6466' },
  { id: 'black', label: 'Black', bg: '#141414', ink: '#f5f1e8', subInk: '#a8a29a' },
  { id: 'pink', label: 'Pink', bg: '#f7c6d3', ink: '#6d2238', subInk: '#94485e' },
  { id: 'cream', label: 'Cream', bg: '#f2e8d5', ink: '#3b2f22', subInk: '#7d6b55' },
]

export function getPaper(id) {
  return PAPERS.find((p) => p.id === id) ?? PAPERS[0]
}
