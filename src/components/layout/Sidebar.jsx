import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard" end>
            لوحة التحكم
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/orders">الطلبات</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/add-order">إضافة طلب</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/technicians">الفنيين</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/profile">الملف الشخصي</NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
