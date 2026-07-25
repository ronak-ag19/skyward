import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import Stepper from '../components/Stepper.jsx';

export default function Passengers() {
  const { selectedFlight, passenger, setPassenger } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState(passenger);
  const [errors, setErrors] = useState({});

  if (!selectedFlight) {
    navigate('/', { replace: true });
    return null;
  }

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.age || Number(form.age) < 1) e.age = 'Enter a valid age.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!/^\d{10}$/.test(String(form.phone).replace(/\D/g, ''))) e.phone = 'Enter a 10-digit mobile number.';
    return e;
  }

  function onContinue(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPassenger(form);
    navigate('/extras');
  }

  return (
    <div className="page">
      <Stepper current={2} />
      <h2 className="page-title">Passenger details</h2>
      <p className="page-sub">Enter the traveller’s details as on their government ID.</p>

      <form className="form-card" onSubmit={onContinue} data-testid="passenger-form">
        <label className="field">
          <span className="field-label">Full name</span>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. Aditi Sharma"
            data-testid="passenger-name"
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Age</span>
            <input
              type="number"
              min="1"
              max="120"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              data-testid="passenger-age"
            />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </label>

          <label className="field">
            <span className="field-label">Gender</span>
            <select
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
              data-testid="passenger-gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            data-testid="passenger-email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="field">
          <span className="field-label">Mobile number</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="10-digit mobile"
            data-testid="passenger-phone"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>

        <div className="sticky-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/results')}>
            Back
          </button>
          <button type="submit" className="btn btn-primary btn-lg" data-testid="passenger-continue">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
