import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, AlertCircle, Package } from "lucide-react";

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");

      if (!users) {
        throw new Error("Failed to fetch users data");
      }

      const allOrders = users.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          customerName: user.name,
          customerEmail: user.email,
        }))
      );

      const sortedOrders = allOrders
        .filter((order) => order.orderDate)
        .sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
        .slice(0, 3);

      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      setError("Failed to load recent orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "pending":
        return <Clock size={16} className="text-yellow-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date) ? "—" : date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-full mx-auto transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="text-blue-500" size={20} />
          Recent Orders
        </h3>
        {/* <div className="flex items-center gap-4">
          <button
            onClick={fetchRecentOrders}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Refresh
          </button>
          
        </div> */}
      </div>

      {isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order ID", "Customer", "Date", "Items", "Amount", "Status"].map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      <div className="w-48 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 py-8">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order ID", "Customer", "Date", "Items", "Amount", "Status"].map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-semibold text-gray-900">
                      #{order.id || index + 1}
                    </td>
                    <td className="py-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">
                          {order.customerName || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.customerEmail || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {order.products?.length || 0} items
                    </td>
                    <td className="py-4 text-sm font-semibold text-gray-900">
                      $
                      {(order.totalAmount ??
                        order.products?.reduce(
                          (sum, p) => sum + (Number(p.price) * (p.quantity || 1)),
                          0
                        ) ??
                        0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </td>
                    <td className="py-4">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status
                          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                          : "Pending"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-600">
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;