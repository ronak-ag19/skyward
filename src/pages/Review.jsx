import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { formatMoney, formatDuration, cabinLabel } from '../data/flights.js';
import { airportLabel } from '../data/airports.js';
import Stepper from '../components/Stepper.jsx';

export default function Review() {
  const { selectedFlight, passengers, extras, fare, confirmBooking, BAGGAGE } = useBooking();
  const navigate = useNavigate();

  if (!selectedFlight) {
    navigate('/', { replace: true });
    return null;
  }

  function onPay() {
    const record = confirmBooking();
    navigate('/confirmation', { state: { pnr: record.pnr } });
  }

  const f = selectedFlight;

  return (
    <div className="page">
      <Stepper current={4} />
      <h2 className="page-title">Review &amp; pay</h2>
      <p className="page-sub">Check everything looks right before you pay.</p>

      <div className="review-grid">
        <div className="form-card" data-testid="review-summary">
          <h3 className="group-title">Flight</h3>
          <div className="review-flight">
            <span className="airline-badge">{f.airlineCode}</span>
            <div>
              <div className="airline-name">{f.airline} · {f.flightNo}</div>
              <div className="review-route">
                {airportLabel(f.from)} → {airportLabel(f.to)}
              </div>
              <div className="page-sub">
                {f.date} · {f.depTime}–{f.arrTime} · {formatDuration(f.durationMin)} ·{' '}
                {f.stops === 0 ? 'Non-stop' : `${f.stops} stop`} · {cabinLabel(f.cabin)}
              </div>
            </div>
          </div>

          <h3 className="group-title">{passengers.length > 1 ? `Passengers (${passengers.length})` : 'Passenger'}</h3>
          {passengers.map((p, i) => (
            <div key={i} data-testid={`review-passenger-${i}`}>
              <div className="review-line">
                <span>{p.fullName || '—'}{passengers.length > 1 && i === 0 ? ' · primary' : ''}</span>
                <span className="muted">{p.age ? `${p.age} yrs` : ''} · {p.gender}</span>
              </div>
              <div className="review-line">
                <span className="muted">{p.email}</span>
                <span className="muted">{p.phone}</span>
              </div>
            </div>
          ))}

          <h3 className="group-title">Extras</h3>
          <div className="review-line">
            <span>Seat</span>
            <span className="muted">{extras.seat === 'any' ? 'No preference' : extras.seat}</span>
          </div>
          <div className="review-line">
            <span>Baggage</span>
            <span className="muted">{BAGGAGE[extras.baggage]?.label}</span>
          </div>
        </div>

        <aside className="fare-card" data-testid="fare-breakdown">
          <h3 className="group-title">Fare summary</h3>
          <div className="fare-line"><span>Base fare{fare.count > 1 ? ` (${fare.count} travellers)` : ''}</span><span>{formatMoney(fare.baseFare, fare.currency)}</span></div>
          <div className="fare-line"><span>Seat</span><span>{formatMoney(fare.seatFee, fare.currency)}</span></div>
          <div className="fare-line"><span>Baggage</span><span>{formatMoney(fare.bagFee, fare.currency)}</span></div>
          <div className="fare-line"><span>Taxes &amp; fees</span><span>{formatMoney(fare.taxes, fare.currency)}</span></div>
          <div className="fare-total"><span>Total</span><span data-testid="fare-total">{formatMoney(fare.total, fare.currency)}</span></div>
          <button type="button" className="btn btn-primary btn-lg full" onClick={onPay} data-testid="confirm-pay">
            Pay now
          </button>
          <button type="button" className="btn btn-ghost full" onClick={() => navigate('/extras')}>
            Back
          </button>
        </aside>
      </div>
    </div>
  );
}
