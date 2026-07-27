import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fromUSD } from '../data/currency.js';

const BookingContext = createContext(null);
export const useBooking = () => useContext(BookingContext);

// Add-on fees are defined in a neutral USD base and converted to the booking's
// currency (the departure country's), so a fare always adds up in one currency.
const SEAT_FEE_USD = 3;
const BAGGAGE = {
  cabin: { label: 'Cabin bag only (7 kg)', usd: 0 },
  checked20: { label: 'Add 20 kg checked bag', usd: 8 },
  checked30: { label: 'Add 30 kg checked bag', usd: 12 },
};

const emptySearch = {
  from: 'DEL',
  to: 'BOM',
  departDate: '',
  returnDate: '',
  passengers: 1,
  cabin: 'economy',
};

export const emptyPassenger = {
  fullName: '',
  age: '',
  gender: 'male',
};

// One contact for the whole booking (collected on Review), not per passenger.
const emptyContact = { email: '', phone: '' };

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem('skyward.bookings') || '[]');
  } catch {
    return [];
  }
}

export function BookingProvider({ children }) {
  const [search, setSearch] = useState(emptySearch);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([{ ...emptyPassenger }]);
  const [contact, setContact] = useState({ ...emptyContact });
  const [extras, setExtras] = useState({ seat: 'any', baggage: 'cabin' });
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    localStorage.setItem('skyward.bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Fare covers everyone on the booking: base fare and per-passenger add-ons
  // (seat, baggage) scale by the number of travellers, and taxes follow the base.
  const fare = useMemo(() => {
    const currency = selectedFlight?.currency || 'INR';
    const count = Math.max(1, passengers.length);
    const baseFare = (selectedFlight ? selectedFlight.price : 0) * count;
    const seatFee = (extras.seat === 'any' ? 0 : fromUSD(SEAT_FEE_USD, currency)) * count;
    const bagUsd = BAGGAGE[extras.baggage]?.usd || 0;
    const bagFee = (bagUsd ? fromUSD(bagUsd, currency) : 0) * count;
    const taxes = Math.round(baseFare * 0.12);
    return { currency, count, baseFare, seatFee, bagFee, taxes, total: baseFare + seatFee + bagFee + taxes };
  }, [selectedFlight, extras, passengers]);

  function confirmBooking() {
    const pnr = 'SW' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const record = {
      pnr,
      flight: selectedFlight,
      passengers,
      contact,
      extras,
      fare,
      status: 'Confirmed',
      bookedAt: new Date().toISOString(),
    };
    setBookings((b) => [record, ...b]);
    return record;
  }

  function resetBooking() {
    setSelectedFlight(null);
    setPassengers([{ ...emptyPassenger }]);
    setContact({ ...emptyContact });
    setExtras({ seat: 'any', baggage: 'cabin' });
  }

  const value = {
    search, setSearch,
    selectedFlight, setSelectedFlight,
    passengers, setPassengers,
    contact, setContact,
    extras, setExtras,
    fare,
    bookings, confirmBooking, resetBooking,
    BAGGAGE, SEAT_FEE_USD,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
