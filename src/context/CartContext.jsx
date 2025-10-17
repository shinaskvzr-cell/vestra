import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setCartCount(0);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        const cart = res.data.cart || [];
        
        // ✅ Calculate TOTAL QUANTITY (sum of all item quantities)
        const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(totalQuantity);
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