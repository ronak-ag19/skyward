import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { airportLabel } from '../data/airports.js';
import { formatINR } from '../data/flights.js';

export default function Trips() {
  const { bookings } = useBooking();

  return (
    <div className="page">
      <h2 className="page-title">My trips</h2>
      <p className="page-sub">All your booked flights in one place.</p>

      {bookings.length === 0 ? (
        <div className="empty" data-testid="trips-empty">
          <p>You don’t have any trips yet.</p>
          <Link to="/" className="btn btn-primary">
            Find flights
          </Link>
        </div>
      ) : (
        <ul className="trip-list" data-testid="trip-list">
          {bookings.map((b) => {
            const f = b.flight;
            return (
              <li key={b.pnr} className="trip-card" data-testid={`trip-${b.pnr}`}>
                <div className="trip-main">
                  <div className="review-route">
                    {airportLabel(f.from)} → {airportLabel(f.to)}
                  </div>
                  <div className="page-sub">
                    {f.airline} · {f.flightNo} · {f.date} · {f.depTime}–{f.arrTime}
                  </div>
                  <div className="trip-meta">
                    <span className="pnr-inline">PNR {b.pnr}</span>
                    <span>{b.passenger.fullName}</span>
                    <span>{formatINR(b.fare.total)}</span>
                  </div>
                </div>
                <span className="status status-confirmed" data-testid="trip-status">
                  {b.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
