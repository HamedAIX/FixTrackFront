import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import TrackOrderPage from "./pages/public/TrackOrderPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AddOrderPage from "./pages/dashboard/AddOrderPage";
import OrderDetailsPage from "./pages/dashboard/OrderDetailsPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import TechniciansPage from "./pages/dashboard/TechniciansPage";
import AddTechnicianPage from "./pages/dashboard/AddTechnicianPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <LoginPage />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<Navigate to="/admin" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-order"
            element={
              <ProtectedRoute>
                <AddOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/order-details"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/technicians"
            element={
              <ProtectedRoute>
                <TechniciansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-technician"
            element={
              <ProtectedRoute>
                <AddTechnicianPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
