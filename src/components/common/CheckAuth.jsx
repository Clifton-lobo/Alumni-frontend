import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (location.pathname === "/") {
    if (!isAuthenticated) return <Navigate to="/user/home" replace />;
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/home" replace />;
  }

  const isAuthRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");

  if (isAuthenticated && isAuthRoute) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/home" replace />;
  }

  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/UnAuth" replace />;
  }

  if (isAuthenticated && user?.role === "admin" && location.pathname.startsWith("/user")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;