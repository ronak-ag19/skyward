import { useState, useRef, useEffect } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const parseISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (s) => {
  const d = parseISO(s);
  return d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
};

// A real in-page calendar (not a native <input type=date>) so the date is
// chosen by clicking a day — which is what a walkthrough should actually show.
export default function DatePicker({ value, onChange, testid, placeholder = 'Select date', min }) {
  const [open, setOpen] = useState(false);
  const sel = parseISO(value);
  const [view, setView] = useState(() => sel || new Date());
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const y = view.getFullYear();
  const m = view.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const minD = parseISO(min);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const pick = (d) => { onChange(toISO(new Date(y, m, d))); setOpen(false); };

  return (
    <div className="dp" ref={ref}>
      <button
        type="button"
        className="dp-trigger"
        data-testid={testid}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? '' : 'dp-ph'}>{value ? fmt(value) : placeholder}</span>
        <span className="dp-ico" aria-hidden="true">📅</span>
      </button>

      {open && (
        <div className="dp-cal" role="dialog" aria-label="Choose a date" data-testid={`${testid}-calendar`}>
          <div className="dp-head">
            <button type="button" className="dp-nav" data-testid="dp-prev" aria-label="Previous month" onClick={() => setView(new Date(y, m - 1, 1))}>‹</button>
            <span className="dp-title">{MONTHS[m]} {y}</span>
            <button type="button" className="dp-nav" data-testid="dp-next" aria-label="Next month" onClick={() => setView(new Date(y, m + 1, 1))}>›</button>
          </div>
          <div className="dp-grid dp-wd">
            {WD.map((w) => <span key={w} className="dp-wdc">{w}</span>)}
          </div>
          <div className="dp-grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} className="dp-empty" />;
              const disabled = minD && new Date(y, m, d) < minD;
              const isSel = sel && sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d;
              return (
                <button
                  key={d}
                  type="button"
                  className={`dp-day${isSel ? ' dp-sel' : ''}`}
                  data-testid={`day-${d}`}
                  disabled={disabled}
                  onClick={() => pick(d)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
