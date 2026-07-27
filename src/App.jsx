import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import Passengers from './pages/Passengers.jsx';
import Review from './pages/Review.jsx';
import Confirmation from './pages/Confirmation.jsx';
import Trips from './pages/Trips.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/review" element={<Review />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>Skyward · a demo flight-booking platform</span>
      </footer>
    </>
  );
}
