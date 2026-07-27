// Airports Skyward serves. Each carries its country and local currency, so the
// app can tell domestic from international routes and price in the right money.
export const AIRPORTS = [
  // India (domestic)
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi Intl', country: 'India', currency: 'INR' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India', currency: 'INR' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl', country: 'India', currency: 'INR' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi Intl', country: 'India', currency: 'INR' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl', country: 'India', currency: 'INR' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl', country: 'India', currency: 'INR' },
  { code: 'GOI', city: 'Goa', name: 'Manohar Intl', country: 'India', currency: 'INR' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India', currency: 'INR' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbai Patel Intl', country: 'India', currency: 'INR' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur Intl', country: 'India', currency: 'INR' },
  // International
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'United Arab Emirates', currency: 'AED' },
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore', currency: 'SGD' },
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom', currency: 'GBP' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', currency: 'EUR' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl', country: 'United States', currency: 'USD' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl', country: 'United States', currency: 'USD' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita Intl', country: 'Japan', currency: 'JPY' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia', currency: 'AUD' },
];

export const airportByCode = (code) => AIRPORTS.find((a) => a.code === code);
export const airportLabel = (code) => {
  const a = airportByCode(code);
  return a ? `${a.city} (${a.code})` : code;
};

// The local currency at an airport (defaults to USD if unknown).
export const airportCurrency = (code) => airportByCode(code)?.currency || 'USD';

// True when the two airports are in different countries (an international trip).
export const isInternational = (from, to) => {
  const a = airportByCode(from);
  const b = airportByCode(to);
  return Boolean(a && b && a.country !== b.country);
};

// Airports grouped by country for the search dropdowns, India first.
export const airportsByCountry = () => {
  const groups = new Map();
  for (const a of AIRPORTS) {
    if (!groups.has(a.country)) groups.set(a.country, []);
    groups.get(a.country).push(a);
  }
  return [...groups.entries()]
    .map(([country, airports]) => ({ country, airports }))
    .sort((x, y) => (x.country === 'India' ? -1 : y.country === 'India' ? 1 : x.country.localeCompare(y.country)));
};
