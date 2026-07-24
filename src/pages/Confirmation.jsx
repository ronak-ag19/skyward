import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { airportLabel } from '../data/airports.js';
import { formatINR } from '../data/flights.js';

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

  return (
    <div className="page">
      <div className="confirm-card" data-testid="confirmation">
        <div className="confirm-check" aria-hidden="true">✓</div>
        <h2 className="page-title">Your ticket is booked!</h2>
        <p className="page-sub">A confirmation has been sent to {booking.passenger.email}.</p>

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
          <div className="confirm-total">Paid {formatINR(booking.fare.total)}</div>
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
