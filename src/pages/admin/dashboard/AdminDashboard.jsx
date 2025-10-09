import React from "react";
import { FaUsers, FaBox, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <p className="mb-4">Navigation</p>
        <button className="p-2 mb-2 text-left w-full hover:bg-gray-700 rounded flex items-center">
          <FaUsers className="mr-2" /> Users
        </button>
        <button className="p-2 mb-2 text-left w-full hover:bg-gray-700 rounded flex items-center">
          <FaBox className="mr-2" /> Products
        </button>
        <button className="p-2 mb-2 text-left w-full hover:bg-gray-700 rounded flex items-center">
          <FaShoppingCart className="mr-2" /> Orders
        </button>
        <button
          onClick={handleLogout}
          className="mt-auto p-2 bg-red-600 rounded hover:bg-red-700 flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Users" value={120} icon={<FaUsers />} />
          <StatCard title="Total Products" value={50} icon={<FaBox />} />
          <StatCard title="Total Orders" value={75} icon={<FaShoppingCart />} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
    <div className="text-3xl text-gray-600">{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
