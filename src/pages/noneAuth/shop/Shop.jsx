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
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";




function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchName, setSearchName] = useState(localStorage.getItem("Jersey Name") || "");
  const [selectedYear, setSelectedYear] = useState(localStorage.getItem("Year") || "");
  const [selectedKit, setSelectedKit] = useState(localStorage.getItem("Kit") || "");
  const [sortOption, setSortOption] = useState(localStorage.getItem("Sort") || "year-desc");
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
    localStorage.setItem("Jersey Name", searchName)
    localStorage.setItem("Year", selectedYear)
    localStorage.setItem("Kit", selectedKit)
    localStorage.setItem("Sort", sortOption)
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