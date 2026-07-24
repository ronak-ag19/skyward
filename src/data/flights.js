// Deterministic flight generator: the same route always yields the same list,
// so screenshots and demos are stable across runs.

const AIRLINES = [
  { code: 'SW', name: 'Skyward Air' },
  { code: 'IN', name: 'IndiSky' },
  { code: 'AV', name: 'AeroVista' },
  { code: 'JT', name: 'JetTrail' },
];

// Cabin classes and their price multiplier vs the base economy fare.
export const CABINS = [
  { id: 'economy', label: 'Economy', mult: 1 },
  { id: 'premium', label: 'Premium Economy', mult: 1.6 },
  { id: 'business', label: 'Business', mult: 2.8 },
];

export const cabinLabel = (id) => CABINS.find((c) => c.id === id)?.label || 'Economy';

// A tiny seeded hash so prices/times feel real but never change for a route.
function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// Rough base fare by route length (uses the seed as a stand-in for distance).
export function generateFlights({ from, to, date, cabin = 'economy' }) {
  if (!from || !to || from === to) return [];
  const mult = CABINS.find((c) => c.id === cabin)?.mult || 1;
  const base = seed(from + to);
  const count = 5;
  const flights = [];
  for (let i = 0; i < count; i++) {
    const s = seed(`${from}-${to}-${date}-${i}`);
    const airline = AIRLINES[s % AIRLINES.length];
    const depHour = 6 + ((s >> 3) % 15); // 06:00 – 20:00
    const depMin = [0, 15, 30, 45][(s >> 5) % 4];
    const durMin = 75 + ((base >> (i + 2)) % 150); // 1h15 – ~3h45
    const arrTotal = depHour * 60 + depMin + durMin;
    const arrHour = Math.floor(arrTotal / 60) % 24;
    const arrMin = arrTotal % 60;
    const stops = (s >> 7) % 5 === 0 ? 1 : 0;
    const priceEconomy = 2400 + ((base + i * 733) % 5200); // ₹2,400 – ~₹7,600
    flights.push({
      id: `${airline.code}${100 + ((s >> 2) % 800)}-${i}`,
      airlineCode: airline.code,
      airline: airline.name,
      flightNo: `${airline.code} ${100 + ((s >> 2) % 800)}`,
      from,
      to,
      date,
      depTime: `${pad(depHour)}:${pad(depMin)}`,
      arrTime: `${pad(arrHour)}:${pad(arrMin)}`,
      durationMin: durMin,
      stops,
      cabin,
      price: Math.round((priceEconomy * mult) / 10) * 10,
    });
  }
  // Cheapest first — the natural default a traveller scans.
  return flights.sort((a, b) => a.price - b.price);
}

export const formatDuration = (min) => `${Math.floor(min / 60)}h ${pad(min % 60)}m`;
export const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');
