import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
