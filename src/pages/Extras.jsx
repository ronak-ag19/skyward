import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { formatINR } from '../data/flights.js';
import Stepper from '../components/Stepper.jsx';

const SEATS = [
  { id: 'any', label: 'No preference', note: 'Free' },
  { id: 'window', label: 'Window seat', note: '+ ₹200' },
  { id: 'aisle', label: 'Aisle seat', note: '+ ₹200' },
];

export default function Extras() {
  const { selectedFlight, extras, setExtras, BAGGAGE } = useBooking();
  const navigate = useNavigate();

  if (!selectedFlight) {
    navigate('/', { replace: true });
    return null;
  }

  const setSeat = (seat) => setExtras((x) => ({ ...x, seat }));
  const setBag = (baggage) => setExtras((x) => ({ ...x, baggage }));

  return (
    <div className="page">
      <Stepper current={3} />
      <h2 className="page-title">Add extras</h2>
      <p className="page-sub">Choose your seat and baggage. You can skip this and continue.</p>

      <div className="form-card">
        <h3 className="group-title">Seat preference</h3>
        <div className="option-row" data-testid="seat-options">
          {SEATS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`option ${extras.seat === s.id ? 'option-active' : ''}`}
              onClick={() => setSeat(s.id)}
              data-testid={`seat-${s.id}`}
            >
              <span className="option-label">{s.label}</span>
              <span className="option-note">{s.note}</span>
            </button>
          ))}
        </div>

        <h3 className="group-title">Baggage</h3>
        <div className="option-list" data-testid="baggage-options">
          {Object.entries(BAGGAGE).map(([id, b]) => (
            <button
              key={id}
              type="button"
              className={`option wide ${extras.baggage === id ? 'option-active' : ''}`}
              onClick={() => setBag(id)}
              data-testid={`baggage-${id}`}
            >
              <span className="option-label">{b.label}</span>
              <span className="option-note">{b.price ? '+ ' + formatINR(b.price) : 'Included'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sticky-actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/passengers')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/review')}
          data-testid="extras-continue"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
