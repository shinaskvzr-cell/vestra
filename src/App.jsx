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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/shop" element={<Shop />} />
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/buy-now" element={<BuyNow />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
