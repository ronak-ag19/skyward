import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header" data-testid="app-header">
      <div className="header-in">
        <Link to="/" className="brand" data-testid="brand-home">
          <span className="brand-mark" aria-hidden="true">✈</span>
          <span className="brand-name">Skyward</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end className="nav-link" data-testid="nav-search">
            Search flights
          </NavLink>
          <NavLink to="/trips" className="nav-link" data-testid="nav-trips">
            My trips
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
