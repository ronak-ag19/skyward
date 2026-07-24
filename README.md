# Skyward ✈️

A small, self-contained **flight-booking platform** built with Vite + React + React Router.
It exists to demo tools that generate help content from a real codebase and a live app.

No backend or API keys — bookings are held in React state and saved to `localStorage`, so it
runs and deploys anywhere as a static site.

## The booking flow

1. **Search flights** (`/`) — pick From, To, departure date, passengers and cabin class.
2. **Select flight** (`/results`) — compare fares and choose a flight.
3. **Passenger details** (`/passengers`) — name, age, gender, email, mobile (with validation).
4. **Add extras** (`/extras`) — seat preference and baggage.
5. **Review & pay** (`/review`) — fare breakdown and **Confirm & Pay**.
6. **Confirmation** (`/confirmation`) — success screen with a booking reference (**PNR**).
7. **My trips** (`/trips`) — every confirmed booking, with its status and PNR.

Interactive elements carry stable `data-testid` attributes (e.g. `search-submit`,
`select-flight-0`, `passenger-name`, `confirm-pay`, `view-trips`) so automated capture is reliable.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build on :5173
```

## Deploy (static)

Any static host works. The app uses client-side routing, so configure an SPA fallback that
serves `index.html` for unknown paths:

- **Netlify** — `netlify.toml` (included) handles it.
- **Vercel** — `vercel.json` (included) handles it.
- **Render** — create a **Static Site**: build command `npm run build`, publish directory
  `dist`, and add a Rewrite rule: source `/*` → destination `/index.html` (Action: Rewrite).
- Other hosts — the `public/_redirects` file covers Netlify-style hosts.

## Try these help-article prompts

- "How do I book a flight step by step?"
- "How do I add checked baggage to my booking?"
- "Where can I find my booking reference (PNR)?"
- "How do I change my seat before paying?"
