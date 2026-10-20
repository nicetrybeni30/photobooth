import './StepPlate.css'

const STEP_TEXT = ['Choose a filter.', 'Strike your best pose!', 'Pick your paper.', 'Grab your print!']

// The engraved steel plate above the screen: booth name + the 4 steps.
// `current` is the index of the active step (0-3).
function StepPlate({ current }) {
  return (
    <div className="step-plate">
      <div className="plate-brand">
        <span className="plate-the">the</span>
        <span className="plate-name">Photobooth</span>
      </div>
      <ol className="plate-steps">
        {STEP_TEXT.map((text, i) => (
          <li key={text} className={i === current ? 'plate-step active' : 'plate-step'}>
            <span className="plate-number">{i + 1}</span>
            <span className="plate-text">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default StepPlate
