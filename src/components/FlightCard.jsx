import { formatDuration, formatINR } from '../data/flights.js';
import { cabinLabel } from '../data/flights.js';

export default function FlightCard({ flight, selected, onSelect, index }) {
  return (
    <div
      className={`flight-card ${selected ? 'selected' : ''}`}
      data-testid={`flight-card-${index}`}
    >
      <div className="flight-airline">
        <span className="airline-badge" aria-hidden="true">
          {flight.airlineCode}
        </span>
        <div>
          <div className="airline-name">{flight.airline}</div>
          <div className="flight-no">{flight.flightNo}</div>
        </div>
      </div>

      <div className="flight-times">
        <div className="time">
          <strong>{flight.depTime}</strong>
          <span>{flight.from}</span>
        </div>
        <div className="flight-duration">
          <span>{formatDuration(flight.durationMin)}</span>
          <div className="flight-line" />
          <span className="flight-stops">
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
          </span>
        </div>
        <div className="time">
          <strong>{flight.arrTime}</strong>
          <span>{flight.to}</span>
        </div>
      </div>

      <div className="flight-buy">
        <div className="flight-cabin">{cabinLabel(flight.cabin)}</div>
        <div className="flight-price">{formatINR(flight.price)}</div>
        <button
          type="button"
          className={`btn ${selected ? 'btn-selected' : 'btn-outline'}`}
          onClick={() => onSelect(flight)}
          data-testid={`select-flight-${index}`}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}
