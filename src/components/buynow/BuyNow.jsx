import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCreditCard,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../navbar/Navbar";

function BuyNow() {
    const location = useLocation();
    const navigate = useNavigate();

    // Handle both single and multiple products
    const { product, products, isMultiple, fromCart } = location.state || {};

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        paymentMethod: "card",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ((!product && !products) || (!isMultiple && !product)) {
            //   toast.warn("No product selected for purchase!");
            toast.warn("No product selected for purchase!", { theme: "colored" });
            navigate("/shop");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (userId) fetchUserDetails(userId);
    }, [product, products, isMultiple, navigate]);

    const fetchUserDetails = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/users/${userId}`);
            const user = res.data;
            setFormData((prev) => ({
                ...prev,
                fullName: user.name || "",
                email: user.email || "",
            }));
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (
            !formData.fullName.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.address.trim()
        ) {
            // toast.warn("Please fill in all required fields!");
            toast.warn("Please fill in all required fields!", { theme: "colored" });
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            // toast.warn("Please login to place an order!");
            toast.error("Please login to place an order!", { theme: "colored" });

            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const orderProducts = isMultiple ? products : [product];

            // Create order object
            const order = {
                id: Date.now().toString(),
                userId,
                products: orderProducts.map((p) => ({
                    id: p.id,
                    name: p.name,
                    image: p.image,
                    kit: p.kit,
                    year: p.year,
                    price: p.price,
                    selectedSize: p.selectedSize,
                    quantity: p.quantity,
                })),
                shippingDetails: formData,
                paymentMethod: formData.paymentMethod,


                totalAmount: orderProducts
                    .reduce((acc, p) => {
                        const price = Number(p.price) || 0;
                        const quantity = Number(p.quantity) || 1;
                        return acc + price * quantity;
                    }, 0)
                    .toFixed(2),



                orderDate: new Date().toISOString(),
                status: "pending",
            };

            // Fetch current user
            const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
            const user = userRes.data;

            // Add new order
            const updatedOrders = [...(user.orders || []), order];

            // Remove ordered items from cart (if from cart)
            let updatedCart = user.cart || [];
            if (fromCart) {
                const orderedIds = orderProducts.map((p) => p.id);
                updatedCart = updatedCart.filter((item) => !orderedIds.includes(item.id));
            }

            // Update user data
            await axios.patch(`http://localhost:5000/users/${userId}`, {
                orders: updatedOrders,
                cart: updatedCart,
            });

            // Update product stock
            for (const p of orderProducts) {
                const productRes = await axios.get(`http://localhost:5000/products/${p.id}`);
                const current = productRes.data;

                const updatedProduct = {
                    ...current,
                    sizes: {
                        ...current.sizes,
                        [p.selectedSize]: current.sizes[p.selectedSize] - p.quantity,
                    },
                    stock: current.stock - p.quantity,
                };

                await axios.put(`http://localhost:5000/products/${p.id}`, updatedProduct);
            }

            // toast.warn("🎉 Order placed successfully!");
            toast.success("🎉 Order placed successfully!", { theme: "colored" });

            navigate("/orders");
        } catch (err) {
            console.error("Error placing order:", err);
            // toast.warn("Error placing order. Please try again.");
            toast.error("Error placing order. Please try again.", { theme: "colored" });

        } finally {
            setLoading(false);
        }
    };

    const items = isMultiple ? products : [product];
    const subtotal = items.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const shippingFee = 5.99;
    const grandTotal = (subtotal + shippingFee).toFixed(2);

    if (!items || items.length === 0)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium text-sm"
                    >
                        <FaArrowLeft size={16} />
                        <span>Back</span>
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Complete Your Purchase
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left - Shipping & Payment */}
                        <div className="lg:col-span-2">
                            <form
                                onSubmit={handlePlaceOrder}
                                className="bg-white rounded-lg shadow-lg p-6"
                            >
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-500" /> Shipping
                                        Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone *
                                            </label>
                                            <div className="relative">
                                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6 pt-6 border-t">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaCreditCard className="text-green-500" /> Payment Method
                                    </h2>
                                    <div className="space-y-3">
                                        {["card", "cod", "upi"].map((method) => (
                                            <label
                                                key={method}
                                                className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500"
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={formData.paymentMethod === method}
                                                    onChange={handleInputChange}
                                                    className="mr-3"
                                                />
                                                <span className="font-medium capitalize">
                                                    {method === "cod" ? "Cash on Delivery" : method.toUpperCase()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </form>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h2>

                                {items.map((p) => (
                                    <div key={p.id} className="mb-4 pb-4 border-b last:border-b-0">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-40 object-cover rounded-lg mb-2"
                                        />
                                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {p.kit} Kit - {p.year}/{p.year + 1}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Size: <span className="font-semibold">{p.selectedSize}</span>{" "}
                                            | Qty: <span className="font-semibold">{p.quantity}</span>
                                        </p>
                                        <p className="text-green-600 font-medium mt-1">
                                            ${(p.price * p.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}

                                <div className="pt-4 border-t text-lg font-bold flex justify-between text-gray-800">
                                    <span>Total:</span>
                                    <span className="text-rose-500">${grandTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyNow;
