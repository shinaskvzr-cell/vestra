import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/products")
        ]);

        const users = usersRes.data;
        const products = productsRes.data;

        let totalRevenue = 0;
        let totalOrders = 0;

        // Loop through users and orders
        users.forEach(user => {
          if (user.orders && user.orders.length > 0) {
            user.orders.forEach(order => {
              // Fix: Calculate totalAmount if it's "NaN" or invalid
              let amount = parseFloat(order.totalAmount);

              if (isNaN(amount)) {
                // Fallback: calculate from products in that order
                amount = order.products?.reduce(
                  (sum, product) => sum + (Number(product.price) || 0),
                  0
                );
              }

              totalRevenue += amount;
            });

            totalOrders += user.orders.length;
          }
        });

        setStats({
          totalRevenue,
          totalOrders,
          totalProducts: products.length,
          totalUsers: users.length,
          monthlyGrowth: ((Math.random() * 20) + 1).toFixed(1) // demo growth %
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      growth: `${stats.monthlyGrowth}%`,
      color: "green"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      growth: "8.2%",
      color: "blue"
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      growth: "5.1%",
      color: "purple"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      growth: "12.5%",
      color: "orange"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm text-green-600">{stat.growth} from last month</span>
              </div>
            </div>
            <div
              className={`p-3 rounded-full
              ${stat.color === 'green' ? 'bg-green-100 text-green-600' : ''}
              ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
              ${stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
              ${stat.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
            `}
            >
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
