import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { generateFlights, cabinLabel } from '../data/flights.js';
import { airportLabel } from '../data/airports.js';
import Stepper from '../components/Stepper.jsx';
import FlightCard from '../components/FlightCard.jsx';

export default function Results() {
  const { search, selectedFlight, setSelectedFlight } = useBooking();
  const navigate = useNavigate();

  const flights = useMemo(
    () => generateFlights({ from: search.from, to: search.to, date: search.departDate, cabin: search.cabin }),
    [search]
  );

  // If someone lands here without a search, send them back home.
  if (!search.departDate) {
    navigate('/', { replace: true });
    return null;
  }

  function onContinue() {
    if (!selectedFlight) return;
    navigate('/passengers');
  }

  return (
    <div className="page">
      <Stepper current={1} />

      <div className="results-head">
        <div>
          <h2 className="page-title">
            {airportLabel(search.from)} → {airportLabel(search.to)}
          </h2>
          <p className="page-sub">
            {search.departDate} · {search.passengers} passenger
            {search.passengers > 1 ? 's' : ''} · {cabinLabel(search.cabin)}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate('/')}
          data-testid="edit-search"
        >
          Edit search
        </button>
      </div>

      <div className="flight-list" data-testid="flight-list">
        {flights.map((f, i) => (
          <FlightCard
            key={f.id}
            index={i}
            flight={f}
            selected={selectedFlight?.id === f.id}
            onSelect={setSelectedFlight}
          />
        ))}
      </div>

      <div className="sticky-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onContinue}
          disabled={!selectedFlight}
          data-testid="results-continue"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
