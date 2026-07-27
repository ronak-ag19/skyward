const STEPS = ['Search', 'Select flight', 'Passenger', 'Review'];

export default function Stepper({ current }) {
  return (
    <ol className="stepper" data-testid="stepper" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        return (
          <li key={label} className={`step ${state}`} data-testid={`stepper-${i + 1}`}>
            <span className="step-dot">{i < current ? '✓' : i + 1}</span>
            <span className="step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
