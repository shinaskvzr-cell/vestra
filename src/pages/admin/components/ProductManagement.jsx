import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('All Leagues');

  // Modal form state
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    league: 'Premier League',
    kit: '',
    price: 0,
    stock: 0,
    image: '',
    topSelling: false,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: productsData } = await axios.get('http://localhost:5000/products');
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/products', newProduct);
      setProducts(prev => [...prev, data]);
      setShowForm(false);
      setNewProduct({
        name: '',
        league: 'Premier League',
        kit: '',
        price: 0,
        stock: 0,
        image: '',
        topSelling: false,
        year: new Date().getFullYear()
      });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleTopSelling = async (productId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/products/${productId}`, {
        topSelling: !currentStatus
      });
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, topSelling: !currentStatus } : p
      ));
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = selectedLeague === 'All Leagues' || p.league === selectedLeague;
    return matchesSearch && matchesLeague;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLeague('All Leagues');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your products and inventory</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option>All Leagues</option>
            <option>Premier League</option>
            <option>La Liga</option>
            <option>Serie A</option>
            <option>MLS</option>
          </select>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter size={16} /> Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Product</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">League</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kit</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Stock</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Featured</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">Year: {product.year}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.league}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.kit}</td>
                <td className="py-4 px-6 text-sm font-semibold text-gray-900">${product.price}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.stock}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => toggleTopSelling(product.id, product.topSelling)}
                    className={`p-1 rounded transition-colors ${product.topSelling ? 'text-yellow-600 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Star size={16} fill={product.topSelling ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="py-4 px-6 flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                    <Eye size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      Add Product Modal
      {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Add Product</h2>

      <form onSubmit={addProduct} className="flex flex-col gap-3">
        {/* Product Name */}
        <label className="text-sm font-medium">Product Name</label>
        <input
          type="text"
          placeholder="e.g., Manchester United Home Jersey"
          required
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Kit Type */}
        <label className="text-sm font-medium">Kit Type</label>
        <input
          type="text"
          placeholder="e.g., Home / Away / Third"
          required
          value={newProduct.kit}
          onChange={(e) =>
            setNewProduct({ ...newProduct, kit: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Price */}
        <label className="text-sm font-medium">Price (₹)</label>
        <input
          type="number"
          placeholder="e.g., 1999"
          required
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Image */}
        <label className="text-sm font-medium">Image URL</label>
        <input
          type="text"
          placeholder="Paste image link here"
          required
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* League */}
        <label className="text-sm font-medium">League</label>
        <select
          value={newProduct.league}
          onChange={(e) =>
            setNewProduct({ ...newProduct, league: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select League</option>
          <option>Premier League</option>
          <option>La Liga</option>
          <option>Serie A</option>
          <option>MLS</option>
          <option>National</option>
        </select>

        {/* Sizes + Quantity */}
        <label className="text-sm font-medium">Available Sizes & Quantities</label>
        <div className="flex flex-col gap-2">
          {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
            <div key={size} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newProduct.sizes?.[size]?.enabled || false}
                onChange={(e) => {
                  const updatedSizes = { ...newProduct.sizes };
                  if (e.target.checked) {
                    updatedSizes[size] = { enabled: true, quantity: 1 };
                  } else {
                    delete updatedSizes[size];
                  }
                  setNewProduct({ ...newProduct, sizes: updatedSizes });
                }}
              />
              <span className="w-8">{size}</span>
              {newProduct.sizes?.[size]?.enabled && (
                <input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={newProduct.sizes[size].quantity}
                  onChange={(e) => {
                    const updatedSizes = { ...newProduct.sizes };
                    updatedSizes[size].quantity = parseInt(e.target.value) || 1;
                    setNewProduct({ ...newProduct, sizes: updatedSizes });
                  }}
                  className="border px-2 py-1 rounded-lg w-20"
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default ProductManagement;
