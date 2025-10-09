import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, Edit, Trash2, Mail, Shield, ShieldOff } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/users');
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBlock = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        isBlock: !currentStatus
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isBlock: !currentStatus } : u));
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const getRoleColor = (role) => role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800';
  const getStatusColor = (isBlock) => isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  const handleClearFilter = () => {
    setSearchQuery("");
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your users and their permissions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button onClick={handleClearFilter} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter size={16} /> Clear Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Orders</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isBlock)}`}>
                    {user.isBlock ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">{user.orders?.length || 0}</td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6 flex items-center gap-2">
                  <button 
                    onClick={() => toggleUserBlock(user.id, user.isBlock)}
                    className={`p-1 rounded ${user.isBlock ? 'text-green-600 hover:bg-green-100' : 'text-yellow-600 hover:bg-yellow-100'}`}
                    title={user.isBlock ? 'Unblock User' : 'Block User'}
                  >
                    {user.isBlock ? <Shield size={16} /> : <ShieldOff size={16} />}
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600" title="Send Email">
                    <Mail size={16} />
                  </button>
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="p-1 text-gray-400 hover:text-red-600" 
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
