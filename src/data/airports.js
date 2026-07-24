// A small, realistic set of airports for the demo search.
export const AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi Intl' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi Intl' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl' },
  { code: 'GOI', city: 'Goa', name: 'Manohar Intl' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbai Patel Intl' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur Intl' },
];

export const airportByCode = (code) => AIRPORTS.find((a) => a.code === code);
export const airportLabel = (code) => {
  const a = airportByCode(code);
  return a ? `${a.city} (${a.code})` : code;
};
