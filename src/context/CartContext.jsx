import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setCartCount(res.data.cart?.length || 0);
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };
    fetchCart();
  }, [userId]);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
