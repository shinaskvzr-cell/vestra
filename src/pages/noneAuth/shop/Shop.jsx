import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Footer from "../../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar/Navbar";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedKit, setSelectedKit] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const data = res.data;
        setProducts(data);
        setFilteredProducts(data);

        const years = [...new Set(data.map((p) => p.year))].sort((a, b) => b - a);
        setAvailableYears(years);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res = await axios.get(`http://localhost:5000/users/${userId}`);
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchProducts();
    fetchUser();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = products;

    if (searchName.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedYear !== "") {
      filtered = filtered.filter((p) => p.year === parseInt(selectedYear));
    }

    if (selectedKit !== "") {
      filtered = filtered.filter(
        (p) => p.kit.toLowerCase() === selectedKit.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchName, selectedYear, selectedKit, products]);

  const handleClearFilters = () => {
    setSearchName("");
    setSelectedYear("");
    setSelectedKit("");
  };

  // Add to Cart
  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    try {
      // Fetch user data
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
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

      // Update JSON server
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        cart: updatedCart,
      });

      // Update local state
      setCurrentUser({ ...user, cart: updatedCart });

      toast.success("✅ Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.warn("Failed to add item to cart!");
    }
  };

  // Add to Wishlist - UPDATED FOR YOUR JSON STRUCTURE
  const handleAddToWishlist = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to add items to wishlist!");
      navigate("/login");
      return;
    }

    try {
      // Fetch current user data
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      // Check if already in wishlist
      const alreadyInWishlist = user.wishlist.some((item) => item.id === product.id);
      if (alreadyInWishlist) {
        toast.warning("Item already in wishlist!");
        return;
      }

      // Add product to wishlist
      const updatedWishlist = [
        ...user.wishlist,
        { ...product } // Add the complete product to wishlist
      ];

      // Update JSON server
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        wishlist: updatedWishlist,
      });

      // Update local state
      setCurrentUser({ ...user, wishlist: updatedWishlist });

      toast.success("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      console.error("Error details:", error.response?.data);
      toast.warn("Failed to add item to wishlist! Check console for details.");
    }
  };

  // Remove from Wishlist - UPDATED FOR YOUR JSON STRUCTURE
  const handleRemoveFromWishlist = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      // Fetch current user data
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      // Remove product from wishlist
      const updatedWishlist = user.wishlist.filter((item) => item.id !== product.id);

      // Update JSON server
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        wishlist: updatedWishlist,
      });

      // Update local state
      setCurrentUser({ ...user, wishlist: updatedWishlist });

      toast.warn("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.warn("Failed to remove item from wishlist!");
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!currentUser || !currentUser.wishlist) return false;
    return currentUser.wishlist.some(item => item.id === productId);
  };

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await handleRemoveFromWishlist(product);
    } else {
      await handleAddToWishlist(product);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Shop 🛒</h1>

        {/* Filters Section */}
        <div className="max-w-4xl mx-auto mb-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Enter product name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Kit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Kit Type
              </label>
              <select
                value={selectedKit}
                onChange={(e) => setSelectedKit(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Kits</option>
                <option value="Home">Home</option>
                <option value="Away">Away</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white shadow-xl rounded-lg p-4"
              >
                <button 
                  className="absolute top-7 right-7 transition-colors"
                  onClick={() => toggleWishlist(product)}
                >
                  {isInWishlist(product.id) ? (
                    <FaHeart size={24} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={24} className="text-gray-300 hover:text-red-500" />
                  )}
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-90 w-full object-cover rounded-md mb-4"
                />

                <div className="text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 flex-1">
                      {product.name}
                    </h2>
                    <span className="text-sm font-medium text-gray-500 ml-2">
                      ({product.year}/{product.year - 1999})
                    </span>
                  </div>

                  <p className="text-base font-medium text-gray-600 mb-3">
                    {product.kit}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-rose-500">
                      ${product.price}
                    </p>

                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      onClick={() => navigate(`/product/${product.id}`)}
                      variant="success"
                      size="small"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">
                No products found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Shop;