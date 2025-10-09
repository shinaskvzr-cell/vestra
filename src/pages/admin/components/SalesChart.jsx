import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const usersRes = await fetch('http://localhost:5000/users');
      const users = await usersRes.json();

      // Collect all orders from all users
      const allOrders = users.flatMap(user =>
        (user.orders || []).map(order => ({
          ...order,
          totalAmount: parseFloat(order.totalAmount) || order.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
          month: new Date(order.orderDate).toLocaleString('default', { month: 'short', year: 'numeric' })
        }))
      );

      // Aggregate sales per month
      const monthlySales = {};
      allOrders.forEach(order => {
        if (!monthlySales[order.month]) {
          monthlySales[order.month] = { sales: 0, revenue: 0 };
        }
        monthlySales[order.month].sales += order.products?.length || 0;
        monthlySales[order.month].revenue += order.totalAmount;
      });

      // Convert to array for Recharts
      const chartData = Object.entries(monthlySales).map(([month, values]) => ({
        month,
        sales: values.sales,
        revenue: values.revenue
      }));

      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="sales" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
