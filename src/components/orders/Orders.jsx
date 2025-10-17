import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import Footer from "../footer/Footer";
import Button from "../button/Button";
import Navbar from "../navbar/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        console.log("User data:", res.data);
        console.log("Orders array:", res.data.orders);

        const userOrders = res.data.orders || [];
        setOrders(userOrders.reverse());
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock />;
      case "shipped":
        return <FaTruck />;
      case "delivered":
        return <FaCheckCircle />;
      default:
        return <FaShoppingBag />;
    }
  };

  // Safe calculation for product total
  const calculateProductTotal = (product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity) || 1; // Default to 1 if quantity is missing
    return (price * quantity).toFixed(2);
  };

  // Safe quantity display
  const getQuantity = (product) => {
    return parseInt(product.quantity) || 1; // Default to 1 if quantity is missing
  };

  if (!userId) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Please Login to View Orders
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Your Orders 🧾
            </h1>

            {orders.length === 0 ? (
              <div className="text-center py-20">
                <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-6">
                  You haven't placed any orders yet.
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">
                          #{order.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">
                          {new Date(order.orderDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="hidden md:inline">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl md:text-2xl font-bold text-rose-500">
                          ${order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Order Products - Added safety check */}
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-800">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {product.kit} Kit - {product.year}/{product.year + 1}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                <span>
                                  Size: <span className="font-semibold">{product.selectedSize}</span>
                                </span>
                                <span>
                                  Qty: <span className="font-semibold">{getQuantity(product)}</span>
                                </span>
                                <span className="text-green-600 font-semibold">
                                  ${calculateProductTotal(product)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">No product details available</p>
                    )}

                    {/* Shipping Details */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Shipping Address:
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingDetails?.fullName || "N/A"}
                        <br />
                        {order.shippingDetails?.address || "N/A"}
                        <br />
                        {order.shippingDetails?.city || "N/A"}
                        {order.shippingDetails?.state && `, ${order.shippingDetails.state}`}
                        {order.shippingDetails?.zipCode && ` - ${order.shippingDetails.zipCode}`}
                        <br />
                        {order.shippingDetails?.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment Method:{" "}
                        <span className="font-semibold capitalize">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Orders;