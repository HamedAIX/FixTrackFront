import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const adminLoggedIn = isAdmin();

  const handleLogout = () => {
    navigate("/", { replace: true });
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          FixTrack
        </Link>
        <div className="navbar-links">
          {adminLoggedIn ? (
            <button type="button" onClick={handleLogout} className="logout-btn">
              تسجيل الخروج
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
