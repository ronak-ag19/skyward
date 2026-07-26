import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { AIRPORTS } from '../data/airports.js';
import { CABINS } from '../data/flights.js';
import DatePicker from '../components/DatePicker.jsx';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Home() {
  const { search, setSearch } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...search, departDate: search.departDate || todayISO() });
  const [error, setError] = useState('');

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function onSearch(e) {
    e.preventDefault();
    if (form.from === form.to) {
      setError('Origin and destination must be different.');
      return;
    }
    if (!form.departDate) {
      setError('Please choose a departure date.');
      return;
    }
    setError('');
    setSearch(form);
    navigate('/results');
  }

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">Your next trip starts here.</h1>
        <p className="hero-sub">Compare real-time fares across 200+ airlines and book in under a minute.</p>
      </section>

      <form className="search-card" onSubmit={onSearch} data-testid="search-form">
        <div className="search-grid">
          <label className="field">
            <span className="field-label">From</span>
            <select
              value={form.from}
              onChange={(e) => update('from', e.target.value)}
              data-testid="search-from"
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">To</span>
            <select
              value={form.to}
              onChange={(e) => update('to', e.target.value)}
              data-testid="search-to"
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span className="field-label">Departure</span>
            <DatePicker
              value={form.departDate}
              onChange={(v) => update('departDate', v)}
              testid="search-depart"
              placeholder="Pick a date"
            />
          </div>

          <div className="field">
            <span className="field-label">Return (optional)</span>
            <DatePicker
              value={form.returnDate}
              onChange={(v) => update('returnDate', v)}
              testid="search-return"
              placeholder="One-way"
              min={form.departDate}
            />
          </div>

          <label className="field">
            <span className="field-label">Passengers</span>
            <input
              type="number"
              min="1"
              max="9"
              value={form.passengers}
              onChange={(e) => update('passengers', Number(e.target.value))}
              data-testid="search-passengers"
            />
          </label>

          <label className="field">
            <span className="field-label">Travel class</span>
            <select
              value={form.cabin}
              onChange={(e) => update('cabin', e.target.value)}
              data-testid="search-cabin"
            >
              {CABINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p className="form-error" data-testid="search-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-lg" data-testid="search-submit">
          Find flights
        </button>
      </form>
    </div>
  );
}
