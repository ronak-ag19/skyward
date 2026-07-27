import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, emptyPassenger } from '../context/BookingContext.jsx';
import Stepper from '../components/Stepper.jsx';

export default function Passengers() {
  const { selectedFlight, passengers, setPassengers, search } = useBooking();
  const navigate = useNavigate();

  // One form per traveller from the search. Seed from anything already entered,
  // padding with blanks or trimming to match the passenger count.
  const count = Math.max(1, Number(search.passengers) || 1);
  const [forms, setForms] = useState(() =>
    Array.from({ length: count }, (_, i) => ({ ...emptyPassenger, ...(passengers[i] || {}) }))
  );
  const [errors, setErrors] = useState([]);

  if (!selectedFlight) {
    navigate('/', { replace: true });
    return null;
  }

  const update = (i, k, v) => setForms((fs) => fs.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));

  function validate() {
    return forms.map((form) => {
      const e = {};
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!form.age || Number(form.age) < 1) e.age = 'Enter a valid age.';
      return e;
    });
  }

  function onContinue(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.some((e) => Object.keys(e).length)) return;
    setPassengers(forms);
    navigate('/extras');
  }

  return (
    <div className="page">
      <Stepper current={2} />
      <h2 className="page-title">Passenger details</h2>
      <p className="page-sub">
        Enter details for {count === 1 ? 'the traveller' : `all ${count} travellers`} as on their government ID.
      </p>

      <form onSubmit={onContinue} data-testid="passenger-form">
        {forms.map((form, i) => (
          <div className="form-card" key={i} data-testid={`passenger-card-${i}`} style={{ marginBottom: 'var(--sp-5, 16px)' }}>
            <h3 className="group-title">
              {count > 1 ? `Passenger ${i + 1}${i === 0 ? ' (primary contact)' : ''}` : 'Traveller'}
            </h3>

            <label className="field">
              <span className="field-label">Full name</span>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update(i, 'fullName', e.target.value)}
                placeholder="e.g. Aditi Sharma"
                data-testid={`passenger-name-${i}`}
              />
              {errors[i]?.fullName && <span className="field-error">{errors[i].fullName}</span>}
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Age</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => update(i, 'age', e.target.value)}
                  data-testid={`passenger-age-${i}`}
                />
                {errors[i]?.age && <span className="field-error">{errors[i].age}</span>}
              </label>

              <label className="field">
                <span className="field-label">Gender</span>
                <select
                  value={form.gender}
                  onChange={(e) => update(i, 'gender', e.target.value)}
                  data-testid={`passenger-gender-${i}`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>
          </div>
        ))}

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
