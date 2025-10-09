import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const { data: users } = await axios.get('http://localhost:3001/users');
      
      // Flatten all orders
      const allOrders = users.flatMap(user =>
        (user.orders || []).map(order => ({
          ...order,
          customerName: user.name,
          customerEmail: user.email
        }))
      );

      // Sort by date descending and get the latest 5 orders
      const sortedOrders = allOrders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);

      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Order ID</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Items</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="py-4">
                  <div>
                    <span className="text-sm text-gray-900 block">{order.customerName}</span>
                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                <td className="py-4 text-sm text-gray-500">{order.products?.length || 0} items</td>
                <td className="py-4 text-sm font-semibold text-gray-900">
                  ${parseFloat(order.totalAmount) || order.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0}
                </td>
                <td className="py-4">
                  <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                  </div>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
