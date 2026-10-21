import { FILTERS, toSvgMatrix } from '../utils/filters.js'

// Invisible <svg> holding one <filter> per photo filter.
// CSS can then use them: `filter: url(#filter-bw)`.
function FilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {FILTERS.filter((f) => f.matrix).map((f) => (
          // sRGB here so the math matches the canvas pixel math exactly.
          <filter key={f.id} id={`filter-${f.id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={toSvgMatrix(f.matrix)} />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

export default FilterDefs
