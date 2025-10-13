import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const res = await fetch('http://localhost:5000/users'); // ✅ make sure matches your JSON server
      const users = await res.json();

      // Collect all orders from all users
      const allOrders = users.flatMap((user) =>
        (user.orders || []).map((order) => {
          const totalAmount =
            parseFloat(order.totalAmount) ||
            (order.products || []).reduce(
              (sum, p) => sum + (Number(p.price) * (p.quantity || 1)),
              0
            ) ||
            0;

          // ✅ Format order date as "10 Oct" etc.
          const orderDay = new Date(order.orderDate).toLocaleDateString('default', {
            day: 'numeric',
            month: 'short',
          });

          return {
            day: orderDay,
            totalAmount,
            productCount: (order.products || []).reduce(
              (count, p) => count + (p.quantity || 1),
              0
            ),
          };
        })
      );

      // ✅ Aggregate by day
      const dailySales = {};
      allOrders.forEach((order) => {
        if (!dailySales[order.day]) {
          dailySales[order.day] = { sales: 0, revenue: 0 };
        }
        dailySales[order.day].sales += order.productCount;
        dailySales[order.day].revenue += order.totalAmount;
      });

      // ✅ Convert object → sorted array
      const chartData = Object.entries(dailySales)
        .map(([day, values]) => ({
          day,
          sales: values.sales,
          revenue: parseFloat(values.revenue.toFixed(2)),
        }))
        .sort((a, b) => {
          // Sort by actual date (assume current month)
          const now = new Date();
          const parse = (d) => new Date(`${d} ${now.getFullYear()}`);
          return parse(a.day) - parse(b.day);
        });

      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Daily Sales Analytics</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue'
                  ? [`₹${value.toLocaleString()}`, 'Revenue']
                  : [value, 'Items Sold']
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
