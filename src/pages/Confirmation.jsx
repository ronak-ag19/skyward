import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { airportLabel } from '../data/airports.js';
import { formatMoney } from '../data/flights.js';

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookings, resetBooking } = useBooking();

  const pnr = state?.pnr;
  const booking = bookings.find((b) => b.pnr === pnr) || bookings[0];

  useEffect(() => {
    if (!booking) navigate('/', { replace: true });
  }, [booking, navigate]);

  if (!booking) return null;
  const f = booking.flight;
  // Support both the current passengers array and older single-passenger records.
  const pax = booking.passengers || (booking.passenger ? [booking.passenger] : []);
  const primary = pax[0] || {};

  return (
    <div className="page">
      <div className="confirm-card" data-testid="confirmation">
        <div className="confirm-check" aria-hidden="true">✓</div>
        <h2 className="page-title">Your ticket is booked!</h2>
        <p className="page-sub">
          A confirmation for {pax.length === 1 ? 'your trip' : `all ${pax.length} travellers`} has been sent to {primary.email}.
        </p>

        <div className="pnr-box" data-testid="pnr">
          <span className="pnr-label">Booking reference (PNR)</span>
          <span className="pnr-code">{booking.pnr}</span>
        </div>

        <div className="confirm-flight">
          <div className="review-route">
            {airportLabel(f.from)} → {airportLabel(f.to)}
          </div>
          <div className="page-sub">
            {f.airline} · {f.flightNo} · {f.date} · {f.depTime}–{f.arrTime}
          </div>
          {pax.length > 0 && (
            <div className="page-sub" data-testid="confirm-passengers">
              {pax.length === 1 ? pax[0].fullName : `${pax.length} travellers: ${pax.map((p) => p.fullName).filter(Boolean).join(', ')}`}
            </div>
          )}
          <div className="confirm-total">Paid {formatMoney(booking.fare.total, booking.fare?.currency || f?.currency || 'INR')}</div>
        </div>

        <div className="sticky-actions center">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              resetBooking();
              navigate('/trips');
            }}
            data-testid="view-trips"
          >
            View my trips
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              resetBooking();
              navigate('/');
            }}
          >
            Book another flight
          </button>
        </div>
      </div>
    </div>
  );
}
