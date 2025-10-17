import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Plus, Edit, Trash2, Eye, Star, Package, AlertCircle, X } from "lucide-react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [actionLoading, setActionLoading] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [productForm, setProductForm] = useState({
    name: "",
    league: "Premier League",
    kit: "",
    price: 0,
    stock: 0,
    image: "",
    topSelling: false,
    year: new Date().getFullYear(),
    sizes: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      "2XL": 0
    }
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:5000/products");
      if (!data) throw new Error("No products data received");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!showForm) {
      setEditingProduct(null);
      setProductForm({
        name: "",
        league: "Premier League",
        kit: "",
        price: 0,
        stock: 0,
        image: "",
        topSelling: false,
        year: new Date().getFullYear(),
        sizes: {
          XS: 0,
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          "2XL": 0
        }
      });
    }
  }, [showForm]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      league: product.league || "Premier League",
      kit: product.kit || "",
      price: product.price || 0,
      stock: product.stock || 0,
      image: product.image || "",
      topSelling: product.topSelling || false,
      year: product.year || new Date().getFullYear(),
      sizes: product.sizes || {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        "2XL": 0
      }
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingKey = editingProduct ? `edit-${editingProduct.id}` : 'add';
    
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
    try {
      if (editingProduct) {
        // Update existing product
        const { data } = await axios.patch(
          `http://localhost:5000/products/${editingProduct.id}`,
          productForm
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data : p))
        );
      } else {
        // Add new product
        const { data } = await axios.post("http://localhost:5000/products", productForm);
        setProducts((prev) => [...prev, data]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(`Failed to ${editingProduct ? 'update' : 'add'} product.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      league: "Premier League",
      kit: "",
      price: 0,
      stock: 0,
      image: "",
      topSelling: false,
      year: new Date().getFullYear(),
      sizes: {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        "2XL": 0
      }
    });
    setEditingProduct(null);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setActionLoading((prev) => ({ ...prev, add: true }));
    try {
      const { data } = await axios.post("http://localhost:5000/products", productForm);
      setProducts((prev) => [...prev, data]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    } finally {
      setActionLoading((prev) => ({ ...prev, add: false }));
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Delete product after confirmation
  const deleteProduct = async () => {
    if (!productToDelete) return;
    
    setActionLoading((prev) => ({ ...prev, [productToDelete.id]: true }));
    try {
      await axios.delete(`http://localhost:5000/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [productToDelete.id]: false }));
    }
  };

  const toggleTopSelling = async (productId, currentStatus) => {
    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await axios.patch(`http://localhost:5000/products/${productId}`, {
        topSelling: !currentStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, topSelling: !currentStatus } : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update top-selling status.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesLeague = selectedLeague === "All Leagues" || p.league === selectedLeague;
    return matchesSearch && matchesLeague;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLeague("All Leagues");
  };

  const calculateTotalStock = (sizes) => {
    if (!sizes) return 0;
    return Object.values(sizes).reduce((total, qty) => total + (qty || 0), 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-full mx-auto transition-all hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="text-blue-500" size={20} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
            <p className="text-sm text-gray-600">Manage your products and inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option>All Leagues</option>
            <option>Premier League</option>
            <option>La Liga</option>
            <option>Serie A</option>
            <option>MLS</option>
            <option>SPL</option>
          </select>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Filter size={16} /> Clear Filters
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 py-8">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Product", "League", "Kit", "Price", "Stock", "Featured", "Actions"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="text-left py-3 px-6 text-sm font-semibold text-gray-600"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Product", "League", "Kit", "Price", "Stock", "Featured", "Actions"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="text-left py-3 px-6 text-sm font-semibold text-gray-600"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/fallback-image.jpg"}
                          alt={product.name || "Product"}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                          loading="lazy"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {product.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-600">Year: {product.year || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.league || "N/A"}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.kit || "N/A"}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                      ${product.price?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {calculateTotalStock(product.sizes) || product.stock || 0}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleTopSelling(product.id, product.topSelling)}
                        disabled={actionLoading[product.id]}
                        className={`p-1 rounded transition-colors ${
                          product.topSelling
                            ? "text-yellow-600 hover:bg-yellow-100"
                            : "text-gray-600 hover:bg-gray-100"
                        } ${actionLoading[product.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={product.topSelling ? "Remove from Featured" : "Mark as Featured"}
                        aria-label={product.topSelling ? "Remove from Featured" : "Mark as Featured"}
                      >
                        {actionLoading[product.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Star size={16} fill={product.topSelling ? "currentColor" : "none"} />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                        title="Edit Product"
                        aria-label="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        disabled={actionLoading[product.id]}
                        className={`p-1 text-gray-600 hover:text-red-600 transition-colors ${
                          actionLoading[product.id] ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title="Delete Product"
                        aria-label="Delete Product"
                      >
                        {actionLoading[product.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-600">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Manchester United Home Jersey"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Kit Type *</label>
                  <select
                    value={productForm.kit}
                    onChange={(e) => setProductForm({ ...productForm, kit: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                    required
                  >
                    <option value="">Select Kit Type</option>
                    <option value="Home">Home Kit</option>
                    <option value="Away">Away Kit</option>
                    <option value="Third">Third Kit</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Training">Training</option>
                    <option value="Special Edition">Special Edition</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 1999"
                    required
                    value={productForm.price || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">League *</label>
                  <select
                    value={productForm.league}
                    onChange={(e) => setProductForm({ ...productForm, league: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                    required
                  >
                    <option value="">Select League</option>
                    <option>Premier League</option>
                    <option>La Liga</option>
                    <option>Serie A</option>
                    <option>MLS</option>
                    <option>National</option>
                    <option>Bundesliga</option>
                    <option>SPL</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Image URL *</label>
                  <input
                    type="url"
                    placeholder="Paste image link here"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                  {productForm.image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Image Preview:</p>
                      <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={productForm.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Year *</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="e.g., 2025"
                    required
                    value={productForm.year}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        year: parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                {/* Sizes & Stock Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Available Sizes & Stock Count
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                      <div key={size} className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">{size}</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Qty"
                          value={productForm.sizes?.[size] || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              sizes: {
                                ...productForm.sizes,
                                [size]: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="mt-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Total Stock: {calculateTotalStock(productForm.sizes)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="topSelling"
                    checked={productForm.topSelling}
                    onChange={(e) =>
                      setProductForm({ ...productForm, topSelling: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="topSelling" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Mark as Top Selling
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="col-span-2 flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.add || actionLoading[`edit-${editingProduct?.id}`]}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm flex items-center gap-2 ${
                    (actionLoading.add || actionLoading[`edit-${editingProduct?.id}`]) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {(actionLoading.add || actionLoading[`edit-${editingProduct?.id}`]) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {editingProduct ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingProduct ? "Update Product" : "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={productToDelete.image || "/fallback-image.jpg"} 
                    alt={productToDelete.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{productToDelete.name}</h3>
                  <p className="text-sm text-gray-600">{productToDelete.league} • {productToDelete.kit}</p>
                  <p className="text-sm text-gray-600">Year: {productToDelete.year}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Warning: This action is permanent!</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deleteProduct}
                disabled={actionLoading[productToDelete.id]}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm flex items-center gap-2 ${
                  actionLoading[productToDelete.id] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionLoading[productToDelete.id] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;