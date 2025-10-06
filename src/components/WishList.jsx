import React, { useState, useEffect } from "react";
import Footer from "./footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "./button/Button";
import { toast } from "react-toastify";

function Wishlist() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  // Load user data with wishlist
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res = await axios.get(`${API_URL}/users/${userId}`);
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Remove item from wishlist
  const handleRemove = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      // Fetch current user data
      const userRes = await axios.get(`${API_URL}/users/${userId}`);
      const user = userRes.data;

      // Remove product from wishlist
      const updatedWishlist = user.wishlist.filter((item) => item.id !== productId);

      // Update JSON server
      await axios.patch(`${API_URL}/users/${userId}`, {
        wishlist: updatedWishlist,
      });

      // Update local state
      setCurrentUser({ ...user, wishlist: updatedWishlist });

      toast.warn("Removed from wishlist!");
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Move item to cart
  const moveToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warning("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    try {
      // Fetch current user data
      const userRes = await axios.get(`${API_URL}/users/${userId}`);
      const user = userRes.data;

      // Check if already in cart
      const alreadyInCart = user.cart.some((item) => item.id === product.id);
      if (alreadyInCart) {
        toast.success("Item already in cart!");
        return;
      }

      // Add product to cart
      const updatedCart = [
        ...user.cart,
        { ...product, quantity: 1, selectedSize: "M" },
      ];

      // Remove from wishlist
      const updatedWishlist = user.wishlist.filter((item) => item.id !== product.id);

      // Update JSON server
      await axios.patch(`${API_URL}/users/${userId}`, {
        cart: updatedCart,
        wishlist: updatedWishlist,
      });

      // Update local state
      setCurrentUser({
        ...user,
        cart: updatedCart,
        wishlist: updatedWishlist
      });

      toast.success("✅ Moved to cart successfully!");
      navigate("/cart");
    } catch (err) {
      console.error("Error moving item to cart:", err);
      toast.error("Failed to move item to cart!");
    }
  };

  const wishlistItems = currentUser?.wishlist || [];

  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist ❤️</h1>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">Your wishlist is empty</p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-4 gap-4">
                <img src={item.image} alt={item.name} className="h-32 w-32 object-cover rounded-md" />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{item.kit} Kit - {item.year}</p>
                  <p className="text-rose-500 font-bold text-lg">${item.price}</p>

                  <div className="mt-2 flex gap-4">

                    <Button onClick={() => moveToCart(item)} size="small" variant="success">Move to Cart</Button>


                    <Button onClick={() => handleRemove(item.id)} variant="danger" size="small">Remove</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;