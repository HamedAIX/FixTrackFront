import { Link, NavLink, useNavigate } from "react-router-dom";
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/track-order"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            تتبع الطلب
          </NavLink>

          {adminLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                لوحة الأدمن
              </NavLink>
              <button type="button" onClick={handleLogout} className="logout-btn">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link login-link ${isActive ? "active" : ""}`
              }
            >
              دخول الأدمن
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
