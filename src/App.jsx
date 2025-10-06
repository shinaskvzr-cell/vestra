import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/noneAuth/landing/hero/Home";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import Shop from "./pages/noneAuth/shop/Shop";
import About from "./pages/noneAuth/about/About";
import Contact from "./pages/noneAuth/contact/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./components/Cart";
import Wishlist from "./components/WishList";
import Orders from "./components/Orders";
import BuyNow from "./components/BuyNow";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buy-now"
          element={
            <ProtectedRoute>
              <BuyNow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" className="custom-toast" autoClose={2000} />
    </Router>
  );
}

export default App;
