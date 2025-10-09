import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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

  // 🔹 Class for active links
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-400 border-b-2 border-green-400 pb-1"
      : "hover:text-gray-300 transition-colors";

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center relative z-50">
      {/* Brand Logo */}
      <Link to="/" className="font-bold text-2xl tracking-wide">
        VESTRA
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-12">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/shop" className={linkClass}>
          Shop
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact Us
        </NavLink>
      </div>

      {/* Right Side: Cart, Wishlist, Profile/Login */}
      <div className="hidden md:flex items-center space-x-4">


        <NavLink to="/cart" className={linkClass}>
          Cart🛒
        </NavLink>

        <NavLink to="/wishlist" className={linkClass}>
          Wishlist❤️
        </NavLink>

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
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
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
          <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass} onClick={() => setIsOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setIsOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setIsOpen(false)}>
            Contact Us
          </NavLink>
          <NavLink to="/cart" className={linkClass} onClick={() => setIsOpen(false)}>
            Cart
          </NavLink>
          <NavLink to="/wishlist" className={linkClass} onClick={() => setIsOpen(false)}>
            Wishlist
          </NavLink>

          {userId ? (
            <>
              <NavLink to="/profile" className={linkClass} onClick={() => setIsOpen(false)}>
                Profile
              </NavLink>
              <NavLink to="/orders" className={linkClass} onClick={() => setIsOpen(false)}>
                Orders
              </NavLink>
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
            <NavLink to="/login" className={linkClass} onClick={() => setIsOpen(false)}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
