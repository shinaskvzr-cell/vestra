import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  AlertCircle,
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Track loading for actions

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      if (!users) throw new Error("No users data received");

      const allOrders = users.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          userId: user.id, // Store userId for status updates
          customerName: order.shippingDetails?.fullName || user.name || "Unknown",
          customerEmail: order.shippingDetails?.email || user.email || "N/A",
          customerPhone: order.shippingDetails?.phone || user.phone || "N/A",
          customerAddress: order.shippingDetails?.address || user.address || "N/A",
        }))
      );

      // Sort orders by date (newest first)
      const sortedOrders = allOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate || a.createdAt || 0);
        const dateB = new Date(b.orderDate || b.createdAt || 0);
        return dateB - dateA; // Descending order (newest first)
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus, userId) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const { data: user } = await axios.get(`http://localhost:5000/users/${userId}`);
      if (!user) throw new Error("User not found");

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        orders: updatedOrders,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Failed to update order status.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "shipped":
        return <Truck size={16} className="text-blue-600" />;
      case "processing":
        return <Clock size={16} className="text-yellow-600" />;
      case "pending":
        return <Clock size={16} className="text-gray-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment?.toLowerCase()) {
      case "card":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const OrderStatusDropdown = ({ order, onStatusChange }) => {
    const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

    return (
      <select
        value={order.status || "pending"}
        onChange={(e) => onStatusChange(order.id, e.target.value, order.userId)}
        disabled={actionLoading[order.id]}
        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
          order.status
        )} focus:ring-2 focus:ring-blue-500 outline-none ${
          actionLoading[order.id] ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Update order status"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-full mx-auto transition-all hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="text-blue-500" size={20} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
            <p className="text-sm text-gray-600">Manage and track customer orders</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{orders.length} orders</span>
          </span>
          {/* <button
            onClick={fetchOrders}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Refresh
          </button> */}
        </div>
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
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Amount",
                  "Items",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      <div className="w-48 h-3 bg-gray-200 rounded"></div>
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
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Amount",
                  "Items",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                      #{order.id || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-600">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                      $
                      {order.totalAmount && order.totalAmount !== "NaN"
                        ? parseFloat(order.totalAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : order.products?.reduce(
                            (sum, p) => sum + (Number(p.price) * (p.quantity || 1)),
                            0
                          )?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.products?.length || 0} items
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                          order.paymentMethod
                        )}`}
                      >
                        {order.paymentMethod?.toUpperCase() || "COD"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status
                            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                            : "Pending"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      {/* <a
                        href={`/orders/${order.id}`}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Order Details"
                        aria-label="View Order Details"
                      >
                        <Eye size={16} />
                      </a> */}
                      <OrderStatusDropdown order={order} onStatusChange={updateOrderStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-600">
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

export default OrderManagement;