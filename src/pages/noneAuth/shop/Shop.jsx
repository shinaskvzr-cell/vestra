import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search, AlertCircle, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";
import { CartContext } from "../../../context/CartContext";
import { WishlistContext } from "../../../context/WishlistContext";

const FilterSection = ({ searchName, setSearchName, selectedYear, setSelectedYear, selectedKit, setSelectedKit, availableYears, handleClearFilters, sortOption, setSortOption }) => (
  <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Filter size={20} className="text-blue-500" />
      Filters
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">Search by Name</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Enter product name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            aria-label="Search products by name"
          />
        </div>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">Filter by Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Filter by year"
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
        <label className="block text-sm font-semibold text-gray-600 mb-2">Filter by Kit Type</label>
        <select
          value={selectedKit}
          onChange={(e) => setSelectedKit(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Filter by kit type"
        >
          <option value="">All Kits</option>
          <option value="Home">Home</option>
          <option value="Away">Away</option>
          <option value="Third">Third</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">Sort By</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Sort products"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="year-desc">Year (Newest)</option>
          <option value="year-asc">Year (Oldest)</option>
        </select>
      </div>

      {/* Clear Filters */}
      <div className="flex items-end">
        <button
          onClick={handleClearFilters}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          aria-label="Clear all filters and sort"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  const itemsPerPage = 8;
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Items Count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{startItem}-{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <FaChevronLeft size={14} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedKit, setSelectedKit] = useState("");
  const [sortOption, setSortOption] = useState("year-desc");
  const [availableYears, setAvailableYears] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const { updateWishlistCount } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/products");
        if (!res.data) throw new Error("No products data received");
        const data = res.data;
        setProducts(data);
        setFilteredProducts(data);
        const years = [...new Set(data.map((p) => p.year))].sort((a, b) => b - a);
        setAvailableYears(years);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
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

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...products];

    if (searchName.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedYear !== "") {
      filtered = filtered.filter((p) => p.year === parseInt(selectedYear));
    }

    if (selectedKit !== "") {
      filtered = filtered.filter((p) => p.kit?.toLowerCase() === selectedKit.toLowerCase());
    }

    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "year-desc":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "year-asc":
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchName, selectedYear, selectedKit, sortOption, products]);

  // Pagination logic
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleClearFilters = () => {
    setSearchName("");
    setSelectedYear("");
    setSelectedKit("");
    setSortOption("year-desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      const alreadyInCart = user.cart?.some((item) => item.id === product.id);
      if (alreadyInCart) {
        toast.success("Item already in cart!");
        return;
      }

      const updatedCart = [...(user.cart || []), { ...product, quantity: 1, selectedSize: "M" }];

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        cart: updatedCart,
      });

      setCurrentUser({ ...user, cart: updatedCart });
      updateCartCount(updatedCart.length);
      toast.success("✅ Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.warn("Failed to add item to cart!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to add items to wishlist!");
      navigate("/login");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      const alreadyInWishlist = user.wishlist?.some((item) => item.id === product.id);
      if (alreadyInWishlist) {
        toast.warning("Item already in wishlist!");
        return;
      }

      const updatedWishlist = [...(user.wishlist || []), { ...product }];

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        wishlist: updatedWishlist,
      });

      setCurrentUser({ ...user, wishlist: updatedWishlist });
      updateWishlistCount(updatedWishlist.length);
      toast.success("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.warn("Failed to add item to wishlist!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleRemoveFromWishlist = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setActionLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      const updatedWishlist = user.wishlist?.filter((item) => item.id !== product.id) || [];

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        wishlist: updatedWishlist,
      });

      setCurrentUser({ ...user, wishlist: updatedWishlist });
      updateWishlistCount(updatedWishlist.length);
      toast.warn("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.warn("Failed to remove item from wishlist!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return currentUser?.wishlist?.some((item) => item.id === productId) || false;
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await handleRemoveFromWishlist(product);
    } else {
      await handleAddToWishlist(product);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
          Shop <span role="img" aria-label="Shopping cart">🛒</span>
        </h1>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-600 py-8">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!error && (
          <FilterSection
            searchName={searchName}
            setSearchName={setSearchName}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedKit={selectedKit}
            setSelectedKit={setSelectedKit}
            availableYears={availableYears}
            handleClearFilters={handleClearFilters}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        )}

        {!error && !loading && (
          <div className="max-w-4xl mx-auto mb-4">
            <p className="text-gray-600 text-sm">
              Found <span className="font-semibold">{filteredProducts.length}</span> products
              {filteredProducts.length > 0 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-90 w-full bg-gray-200 rounded-md mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex justify-between gap-2">
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div key={product.id} className="relative bg-white shadow-xl rounded-lg p-4">
                  <button
                    className="absolute top-7 right-7 transition-colors"
                    onClick={() => toggleWishlist(product)}
                    disabled={actionLoading[product.id]}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {actionLoading[product.id] ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                    ) : isInWishlist(product.id) ? (
                      <FaHeart size={24} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={24} className="text-gray-300 hover:text-red-500" />
                    )}
                  </button>

                  <img
                    src={product.image || "/fallback-image.jpg"}
                    onClick={() => navigate(`/product/${product.id}`)}
                    alt={product.name || "Product"}
                    className="h-90 w-full object-cover rounded-md mb-4 cursor-pointer"
                    loading="lazy"
                  />

                  <div className="text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-800 flex-1">
                        {product.name || "Unknown"}
                      </h2>
                      <span className="text-sm font-medium text-gray-500 ml-2">
                        ({product.year || "N/A"}/{(product.year || 2000) - 1999})
                      </span>
                    </div>

                    <p className="text-base font-medium text-gray-600 mb-3">
                      {product.kit || "N/A"}
                    </p>

                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-rose-500">
                        ${product.price?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => handleAddToCart(product)}
                          disabled={actionLoading[product.id]}
                          aria-label="Add to cart"
                        >
                          {actionLoading[product.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            "Add to Cart"
                          )}
                        </Button>
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          variant="success"
                          size="small"
                          aria-label="Buy now"
                        >
                          Buy Now
                        </Button>
                      </div>
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
        )}

        {!error && !loading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredProducts.length}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Shop;