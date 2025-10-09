import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { toast } from "react-toastify";
import Navbar from "../navbar/Navbar";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setCartItems(res.data.cart || []);
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };

    fetchCart();
  }, [userId]);

  const handleRemove = async (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);

    await axios.patch(`http://localhost:5000/users/${userId}`, {
      cart: updatedCart,
    });
  };

  const handleQuantityChange = async (id, value) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Number(value) } : item
    );
    setCartItems(updatedCart);
    await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });
  };

  const handleSizeChange = async (id, size) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, selectedSize: size } : item
    );
    setCartItems(updatedCart);
    await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle buying single product
  const handleBuyNowProduct = async (product) => {
    if (!userId) {
      // toast.warn("Please login to proceed!");
      toast.warn("Please login to proceed!", { theme: "colored" });

      navigate("/login");
      return;
    }

    // Check stock availability
    try {
      const productRes = await axios.get(`http://localhost:5000/products/${product.id}`);
      const currentProduct = productRes.data;

      if (currentProduct.sizes[product.selectedSize] < product.quantity) {
        // toast.warn(`Not enough stock for ${product.name} in size ${product.selectedSize}!`);
        toast.warning(`Not enough stock for ${product.name} in size ${product.selectedSize}!`, { theme: "colored" });

        return;
      }

      // Navigate to BuyNow page with single product
      navigate("/buy-now", {
        state: {
          product: product,
          selectedSize: product.selectedSize,
          quantity: product.quantity,
          fromCart: true // Flag to indicate this came from cart
        }
      });

    } catch (err) {
      console.error("Error checking stock:", err);
      // toast.warn("Error checking product availability. Please try again.");
      toast.error("Error checking product availability. Please try again.", { theme: "colored" });

    }
  };

  // Handle buying all products in cart
  const handleBuyAll = async () => {
    if (!userId) {
      // toast.warn("Please login to proceed!");
      toast.warn("Please login to proceed!", { theme: "colored" });

      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      // toast.warn("Your cart is empty!");
      toast.warn("Your cart is empty!", { theme: "colored" });

      return;
    }

    // Check stock availability for all items
    try {
      for (const item of cartItems) {
        const productRes = await axios.get(`http://localhost:5000/products/${item.id}`);
        const currentProduct = productRes.data;

        if (currentProduct.sizes[item.selectedSize] < item.quantity) {
          // toast.warn(`Not enough stock for ${item.name} in size ${item.selectedSize}!`);
          toast.warning(`Not enough stock for ${item.name} in size ${item.selectedSize}!`, { theme: "colored" });

          return;
        }
      }

      // Navigate to BuyNow page with all cart items
      navigate("/buy-now", {
        state: {
          products: cartItems, // Send all cart items
          fromCart: true,
          isMultiple: true // Flag to indicate multiple products
        }
      });

    } catch (err) {
      console.error("Error checking stock:", err);
      // toast.warn("Error checking product availability. Please try again.");
      toast.error("Error checking product availability. Please try again.", { theme: "colored" });

    }
  };

  return (
    <div>
      <Navbar/>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart 🛒</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">Your cart is empty</p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-4 gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-32 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    {item.kit} Kit - {item.year}
                  </p>
                  <p className="text-rose-500 font-bold text-lg">${item.price}</p>

                  {/* Size */}
                  <div className="mt-2">
                    <label className="mr-2 font-medium">Size:</label>
                    <select
                      value={item.selectedSize}
                      onChange={(e) => handleSizeChange(item.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      {Object.keys(item.sizes || { XS: 0, S: 0, M: 0, L: 0, XL: 0, "2XL": 0 }).map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="mt-2">
                    <label className="mr-2 font-medium">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 w-16"
                    />
                  </div>

                  {/* Item Total */}
                  <div className="mt-2">
                    <p className="font-medium">
                      Item Total: <span className="text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-3 flex gap-4">

                    <Button onClick={() => handleRemove(item.id)} variant="danger" size="small">Remove</Button>


                    <Button onClick={() => handleBuyNowProduct(item)} variant="success">Buy Now</Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Cart Summary</h3>
                <p className="text-lg">
                  Items: <span className="font-semibold">{cartItems.length}</span>
                </p>
              </div>

              <div className="text-right text-2xl font-bold mt-6 flex justify-end items-center gap-4">
                <span>Total: ${totalPrice.toFixed(2)}</span>

                <Button onClick={handleBuyAll} variant="warning">Buy All Items</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;