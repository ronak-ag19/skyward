import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BookingContext = createContext(null);
export const useBooking = () => useContext(BookingContext);

const BAGGAGE = {
  cabin: { label: 'Cabin bag only (7 kg)', price: 0 },
  checked20: { label: 'Add 20 kg checked bag', price: 600 },
  checked30: { label: 'Add 30 kg checked bag', price: 1000 },
};

const emptySearch = {
  from: 'DEL',
  to: 'BOM',
  departDate: '',
  returnDate: '',
  passengers: 1,
  cabin: 'economy',
};

const emptyPassenger = {
  fullName: '',
  age: '',
  gender: 'female',
  email: '',
  phone: '',
};

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
  const [passenger, setPassenger] = useState(emptyPassenger);
  const [extras, setExtras] = useState({ seat: 'any', baggage: 'cabin' });
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    localStorage.setItem('skyward.bookings', JSON.stringify(bookings));
  }, [bookings]);

  const fare = useMemo(() => {
    const baseFare = selectedFlight ? selectedFlight.price : 0;
    const seatFee = extras.seat === 'any' ? 0 : 200;
    const bagFee = BAGGAGE[extras.baggage]?.price || 0;
    const taxes = Math.round(baseFare * 0.12);
    return { baseFare, seatFee, bagFee, taxes, total: baseFare + seatFee + bagFee + taxes };
  }, [selectedFlight, extras]);

  function confirmBooking() {
    const pnr = 'SW' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const record = {
      pnr,
      flight: selectedFlight,
      passenger,
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
    setPassenger(emptyPassenger);
    setExtras({ seat: 'any', baggage: 'cabin' });
  }

  const value = {
    search, setSearch,
    selectedFlight, setSelectedFlight,
    passenger, setPassenger,
    extras, setExtras,
    fare,
    bookings, confirmBooking, resetBooking,
    BAGGAGE,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
