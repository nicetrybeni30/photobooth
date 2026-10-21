import './ChoicePicker.css'

// A row of selectable options, used for both filters and paper colors.
// `swatchStyle(option)` returns the inline style for the little preview circle.
function ChoicePicker({ label, options, value, onChange, swatchStyle }) {
  return (
    <div className="choice-picker" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          className={option.id === value ? 'choice selected' : 'choice'}
          onClick={() => onChange(option.id)}
        >
          <span className="choice-swatch" style={swatchStyle(option)} />
          <span className="choice-label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ChoicePicker
