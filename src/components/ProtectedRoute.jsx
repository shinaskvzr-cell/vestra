import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  const toastShown = useRef(false); // Track if toast has been shown

  useEffect(() => {
    if (!userId && !toastShown.current) {
      toast.warn("Please login to access this page!", { theme: "colored" });
      toastShown.current = true; // Mark toast as shown
    }
  }, [userId]);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
