import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ children, requireAdmin = false }) {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const toastShown = useRef(false);

  useEffect(() => {
    if (!userId && !toastShown.current) {
      toast.warn("Please login to access this page!");
      toastShown.current = true;
    } else if (requireAdmin && userRole !== "admin" && !toastShown.current) {
      toast.error("Access denied. Admins only!");
      toastShown.current = true;
    }
  }, [userId, userRole, requireAdmin]);

  // ✅ If not logged in, redirect to login
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If trying to access admin page without admin role
  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, allow access
  return children;
}

export default ProtectedRoute;
