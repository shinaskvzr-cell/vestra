import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  // Function to update wishlist count
  const updateWishlistCount = (count) => {
    setWishlistCount(count);
  };

  // Fetch wishlist count on component mount and when userId changes
  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res = await axios.get(`http://localhost:5000/users/${userId}`);
          const wishlistLength = res.data.wishlist?.length || 0;
          setWishlistCount(wishlistLength);
        } else {
          setWishlistCount(0);
        }
      } catch (err) {
        console.error("Error fetching wishlist count:", err);
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();

    // Optional: Listen for storage changes (if user logs out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "userId") {
        fetchWishlistCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};