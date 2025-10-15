import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Custom hook to auto-logout blocked users
export const useBlockCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfBlocked = async () => {
      const storedUser = localStorage.getItem("user");

      // ⛔ If no user is logged in, skip check
      if (!storedUser) return;

      try {
        const userData = JSON.parse(storedUser);
        const userId = userData.id;

        // ✅ Fetch user data from backend
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        const user = res.data;

        // ✅ If user is blocked
        if (user.isBlock) {
          // Clear all stored user data
          localStorage.removeItem("user");

          // Show a toast notification
          toast.error("🚫 Your account has been blocked by admin!", {
            position: "top-center",
            autoClose: 3000,
          });

          // Redirect to login page after short delay
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Error checking user block status:", error);
      }
    };

    // ✅ Run immediately
    checkIfBlocked();

    // ✅ Re-check every 10 seconds (10000 ms)
    const interval = setInterval(checkIfBlocked, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [navigate]);
};