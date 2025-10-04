import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    localStorage.removeItem("userId");
    setShowProfileDropdown(false);
    navigate("/");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center relative z-50">
      {/* Brand Logo */}
      <Link to="/" className="font-bold text-2xl tracking-wide">
        VESTRA
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-12">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/shop" className="hover:text-gray-300">Shop</Link>
        <Link to="/about" className="hover:text-gray-300">About</Link>
        <Link to="/contact" className="hover:text-gray-300">Contact Us</Link>
      </div>

      {/* Right Side: Cart, Wishlist, Profile/Login */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/cart" className="hover:text-gray-300 font-semibold">
          Cart
        </Link>

        <Link to="/wishlist" className="hover:text-gray-300 font-semibold">
          Wishlist
        </Link>

        {userId ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <FaUser size={18} />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <FaUser size={16} />
                  <span>Profile</span>
                </Link>
                
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <FaShoppingBag size={16} />
                  <span>Orders</span>
                </Link>

                <hr className="my-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors w-full text-left"
                >
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-gray-300 font-semibold">
            Login
          </Link>
        )}
      </div>

      {/* Hamburger Button (Mobile) */}
      <button
        className="md:hidden focus:outline-none text-2xl z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center space-y-4 py-6 md:hidden z-40">
          <Link to="/" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/shop" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link to="/about" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>

          <Link to="/cart" className="hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>
            Cart
          </Link>
          <Link to="/wishlist" className="hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>
            Wishlist
          </Link>

          {userId ? (
            <>
              <Link to="/profile" className="hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" className="hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>
                Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="hover:text-red-400 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:text-gray-300 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;