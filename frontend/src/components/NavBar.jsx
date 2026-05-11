import { NavLink, Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
    return (
        <header className="navbar">
            <nav className="navbar-container">
                {/* Left side */}
                <ul className="nav-links">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>

                    <li>
                        <NavLink to="/trips/detail/:id">
                            Trip Detail
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/trips/new">
                            Create Trip
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/trips/edit/:id">
                            Edit Trip
                        </NavLink>
                    </li>
                </ul>

                {/* Right side */}
                <div className="logout">
                    <Link to="/login">Logout</Link>
                </div>
            </nav>
        </header>
    );
}