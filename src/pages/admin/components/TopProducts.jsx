import React, { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      // Fetch all users to get orders
      const usersRes = await fetch('http://localhost:5000/users');
      const users = await usersRes.json();

      // Fetch all products
      const productsRes = await fetch('http://localhost:5000/products');
      const products = await productsRes.json();

      // Flatten all orders
      const allOrders = users.flatMap(user => user.orders || []);

      // Calculate sales and revenue for each product
      const productSales = products.map(product => {
        const salesCount = allOrders.reduce((count, order) => {
          const productInOrder = order.products?.find(p => p.id === product.id);
          return productInOrder ? count + 1 : count;
        }, 0);

        const revenue = salesCount * product.price;

        return {
          ...product,
          sales: salesCount,
          revenue
        };
      });

      // Sort by sales and get top 4
      const sortedTopProducts = productSales
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4);

      setTopProducts(sortedTopProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.league}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">${product.revenue?.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-xs text-green-600">{product.sales} sales</span>
              </div>
            </div>
          </div>
        ))}
        {topProducts.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
