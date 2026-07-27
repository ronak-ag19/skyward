import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { formatMoney, formatDuration, cabinLabel } from '../data/flights.js';
import { airportLabel } from '../data/airports.js';
import Stepper from '../components/Stepper.jsx';

export default function Review() {
  const { selectedFlight, passengers, contact, setContact, extras, fare, confirmBooking, BAGGAGE } = useBooking();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  if (!selectedFlight) {
    navigate('/', { replace: true });
    return null;
  }

  const setField = (k, v) => setContact((c) => ({ ...c, [k]: v }));

  function onPay() {
    const e = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) e.email = 'Enter a valid email.';
    if (!/^\d{10}$/.test(String(contact.phone).replace(/\D/g, ''))) e.phone = 'Enter a 10-digit mobile number.';
    setErrors(e);
    if (Object.keys(e).length) return;
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
            <div className="review-line" key={i} data-testid={`review-passenger-${i}`}>
              <span>{p.fullName || '—'}{passengers.length > 1 && i === 0 ? ' · primary' : ''}</span>
              <span className="muted">{p.age ? `${p.age} yrs` : ''} · {p.gender}</span>
            </div>
          ))}

          <h3 className="group-title">Contact details</h3>
          <p className="page-sub" style={{ marginTop: 0 }}>We'll send the ticket and any updates here.</p>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              data-testid="contact-email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label className="field">
            <span className="field-label">Mobile number</span>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="10-digit mobile"
              data-testid="contact-phone"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>

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
