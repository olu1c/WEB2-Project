import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../pictures/pic2.jpg';
import '../NavBar.css';

export default function NavBar() {
  const { logout,role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="navbar-left">
          <img src={logoImg} alt="Logo" className="navbar-logo" />
          <ul className="nav-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/trips/new">Create Trip</NavLink></li>
            {role === 'Admin' && (<li><NavLink to="admin">Admin</NavLink></li>)}
          </ul>
        </div>
        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </header>
  );
}
