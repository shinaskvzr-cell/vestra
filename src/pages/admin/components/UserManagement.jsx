import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Plus, Edit, Trash2, Mail, Shield, ShieldOff, Users, AlertCircle, X } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:5000/users");
      if (!data) throw new Error("No users data received");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserBlock = async (userId, currentStatus) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        isBlock: !currentStatus,
      });
      setUsers(users.map((u) => (u.id === userId ? { ...u, isBlock: !currentStatus } : u)));
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user status.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Delete user after confirmation
  const deleteUser = async () => {
    if (!userToDelete) return;
    
    setActionLoading((prev) => ({ ...prev, [userToDelete.id]: true }));
    try {
      await axios.delete(`http://localhost:5000/users/${userToDelete.id}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userToDelete.id]: false }));
    }
  };

  const getRoleColor = (role) =>
    role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800";
  const getStatusColor = (isBlock) =>
    isBlock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearFilter = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-full mx-auto transition-all hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500" size={20} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600">Manage users and their permissions</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <button
            onClick={fetchUsers}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Refresh
          </button>
          <a
            href="/add-user"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add User
          </a>
        </div> */}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
        </div>
        <button
          onClick={handleClearFilter}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Filter size={16} /> Clear Filter
        </button>
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
                {["User", "Role", "Status", "Orders", "Joined", "Actions"].map((header, index) => (
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-48 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["User", "Role", "Status", "Orders", "Joined", "Actions"].map((header, index) => (
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          user.isBlock
                        )}`}
                      >
                        {user.isBlock ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {user.orders?.length || 0}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <button
                        onClick={() => toggleUserBlock(user.id, user.isBlock)}
                        disabled={actionLoading[user.id]}
                        className={`p-1 rounded ${
                          user.isBlock
                            ? "text-green-600 hover:bg-green-100"
                            : "text-yellow-600 hover:bg-yellow-100"
                        } ${actionLoading[user.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={user.isBlock ? "Unblock User" : "Block User"}
                        aria-label={user.isBlock ? "Unblock User" : "Block User"}
                      >
                        {actionLoading[user.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : user.isBlock ? (
                          <Shield size={16} />
                        ) : (
                          <ShieldOff size={16} />
                        )}
                      </button>
                      {/* <button
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Edit User"
                        aria-label="Edit User"
                      >
                        <Edit size={16} />
                      </button> */}
                      {/* <button
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Send Email"
                        aria-label="Send Email"
                      >
                        <Mail size={16} />
                      </button> */}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={actionLoading[user.id]}
                          className={`p-1 text-gray-600 hover:text-red-600 ${
                            actionLoading[user.id] ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          title="Delete User"
                          aria-label="Delete User"
                        >
                          {actionLoading[user.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Confirm User Deletion</h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {userToDelete.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{userToDelete.name || "Unknown User"}</h3>
                  <p className="text-sm text-gray-600">{userToDelete.email || "N/A"}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userToDelete.role)}`}>
                      {userToDelete.role || "user"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(userToDelete.isBlock)}`}>
                      {userToDelete.isBlock ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Orders:</span> {userToDelete.orders?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Joined:</span>{" "}
                    {userToDelete.createdAt
                      ? new Date(userToDelete.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Warning: This action is permanent!</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  All user orders, cart items, and wishlist data will be lost.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                disabled={actionLoading[userToDelete.id]}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm flex items-center gap-2 ${
                  actionLoading[userToDelete.id] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionLoading[userToDelete.id] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;