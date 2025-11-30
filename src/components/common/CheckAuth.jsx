import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // ------------------------------
  // 1️⃣ ROOT PATH "/" LOGIC
  // ------------------------------
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/home" replace />
    );
  }

  // ------------------------------
  // 2️⃣ UNAUTHENTICATED USERS BLOCKED FROM PROTECTED ROUTES
  // ------------------------------
  const isAuthRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  // ------------------------------
  // 3️⃣ AUTHENTICATED USERS CAN’T ENTER LOGIN/REGISTER AGAIN
  // ------------------------------
  if (isAuthenticated && isAuthRoute) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/home" replace />
    );
  }

  // ------------------------------
  // 4️⃣ NORMAL USER TRYING TO ACCESS /admin/*
  // ------------------------------
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/UnAuth" replace />;
  }

  // ------------------------------
  // 5️⃣ ADMIN TRYING TO ACCESS /user/*
  // ------------------------------
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/user")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }


  return <>{children}</>;
}

export default CheckAuth;
