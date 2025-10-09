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
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");

      // Extract all orders from all users
      const allOrders = users.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          customerName: order.shippingDetails?.fullName || user.name,
          customerEmail: order.shippingDetails?.email || user.email,
          customerPhone: order.shippingDetails?.phone || user.phone,
          customerAddress: order.shippingDetails?.address || user.address,
        }))
      );

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, userId) => {
    try {
      // Get user data first
      const { data: user } = await axios.get(
        `http://localhost:5000/users/${userId}`
      );

      // Update the order's status
      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      // Save changes to db.json
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        orders: updatedOrders,
      });

      // Reflect changes in frontend
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
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
    switch (payment) {
      case "card":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const OrderStatusDropdown = ({ order, onStatusChange }) => {
    const statusOptions = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    return (
      <select
        value={order.status}
        onChange={(e) =>
          onStatusChange(order.id, e.target.value, order.userId)
        }
        className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(
          order.status
        )}`}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Order Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <span className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-900">
            {orders.length} orders
          </span>
        </span>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Amount
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Items
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Payment
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customerEmail}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                  $
                  {order.totalAmount === "NaN"
                    ? order.products?.reduce(
                        (sum, p) => sum + (p.price || 0),
                        0
                      )
                    : parseFloat(order.totalAmount) || 0}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {order.products?.length || 0} items
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(
                      order.paymentMethod
                    )}`}
                  >
                    {order.paymentMethod?.toUpperCase() || "COD"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 flex items-center gap-2">
                  <button
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <OrderStatusDropdown
                    order={order}
                    onStatusChange={updateOrderStatus}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
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

export default OrderManagement;
