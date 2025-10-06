import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Footer from "./footer/Footer";
import { toast } from "react-toastify";

function Profile() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        fetchUserData();
    }, [userId, navigate]);

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/users/${userId}`);
            setUser(res.data);
            setFormData({
                name: res.data.name || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
                address: res.data.address || "",
                city: res.data.city || "",
                state: res.data.state || "",
                zipCode: res.data.zipCode || "",
                country: res.data.country || "",
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch(`http://localhost:5000/users/${userId}`, formData);
            setUser({ ...user, ...formData });
            setIsEditing(false);
            // toast.warn("Profile updated successfully!");
            toast.success("Profile updated successfully!", { theme: "colored" });

        } catch (err) {
            console.error("Error updating profile:", err);
            // toast.warn("Failed to update profile. Please try again.");
            toast.error("Failed to update profile. Please try again.", { theme: "colored" });

        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
            country: user.country || "",
        });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600">User not found</p>
            </div>
        );
    }

    return (
        <div>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{user.name || "User"}</h1>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <FaSave />
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FaTimes />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Account Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{user.orders?.length || 0}</p>
                                <p className="text-sm text-gray-600">Orders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{user.cart?.length || 0}</p>
                                <p className="text-sm text-gray-600">Cart Items</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{user.wishlist?.length || 0}</p>
                                <p className="text-sm text-gray-600">Wishlist</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaUser className="inline mr-2" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.name || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.email || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaPhone className="inline mr-2" />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.phone || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaMapMarkerAlt className="inline mr-2" />
                                    City
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter city"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.city || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaMapMarkerAlt className="inline mr-2" />
                                    Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter full address"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.address || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State/Province
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter state"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.state || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* ZIP Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter ZIP code"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.zipCode || "Not provided"}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter country"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                        {user.country || "Not provided"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate("/orders")}
                            className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-lg transition-colors text-center"
                        >
                            <p className="text-3xl mb-2">📦</p>
                            <p className="font-semibold text-gray-800">My Orders</p>
                            <p className="text-sm text-gray-500">View order history</p>
                        </button>

                        <button
                            onClick={() => navigate("/cart")}
                            className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-lg transition-colors text-center"
                        >
                            <p className="text-3xl mb-2">🛒</p>
                            <p className="font-semibold text-gray-800">My Cart</p>
                            <p className="text-sm text-gray-500">View cart items</p>
                        </button>

                        <button
                            onClick={() => navigate("/wishlist")}
                            className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-lg transition-colors text-center"
                        >
                            <p className="text-3xl mb-2">❤️</p>
                            <p className="font-semibold text-gray-800">Wishlist</p>
                            <p className="text-sm text-gray-500">View saved items</p>
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;