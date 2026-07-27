// Currencies Skyward prices in. Fares are computed in a neutral USD base and
// shown in the departure country's currency, the way a traveller actually pays.
export const CURRENCIES = {
  INR: { locale: 'en-IN', rate: 83 },
  USD: { locale: 'en-US', rate: 1 },
  GBP: { locale: 'en-GB', rate: 0.79 },
  EUR: { locale: 'en-IE', rate: 0.92 },
  AED: { locale: 'en-AE', rate: 3.67 },
  SGD: { locale: 'en-SG', rate: 1.35 },
  JPY: { locale: 'ja-JP', rate: 149 },
  AUD: { locale: 'en-AU', rate: 1.52 },
};

// Convert a USD base amount into `currency`, rounded to a clean increment so
// prices read naturally (e.g. round yen/rupees, not to the last unit).
export function fromUSD(usd, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const step = c.rate >= 100 ? 100 : c.rate >= 50 ? 10 : 1;
  return Math.round((usd * c.rate) / step) * step;
}

// Format an amount already in `currency`, using that currency's locale.
export function formatMoney(amount, currency = 'USD') {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  try {
    return new Intl.NumberFormat(c.locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(Number(amount) || 0).toLocaleString()}`;
  }
}
