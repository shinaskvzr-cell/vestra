import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertCircle } from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/products"),
      ]);

      if (!usersRes.status === 200 || !productsRes.status === 200) {
        throw new Error("Failed to fetch data");
      }

      const users = usersRes.data;
      const products = productsRes.data;

      let totalRevenue = 0;
      let totalOrders = 0;

      users.forEach(user => {
        if (user.orders?.length > 0) {
          user.orders.forEach(order => {
            let amount = parseFloat(order.totalAmount);

            if (isNaN(amount)) {
              amount = order.products?.reduce(
                (sum, product) => sum + (Number(product.price) * (product.quantity || 1)),
                0
              ) || 0;
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
        monthlyGrowth: ((Math.random() * 20) + 1).toFixed(1), // Placeholder growth
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard stats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      growth: `${stats.monthlyGrowth}%`,
      color: "green",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      growth: "8.2%",
      color: "blue",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      growth: "5.1%",
      color: "purple",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      growth: "12.5%",
      color: "orange",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-full mx-auto transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-blue-500" size={20} />
          Dashboard Stats
        </h3>
        {/* <button
          onClick={fetchStats}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Refresh
        </button> */}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 py-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs text-green-600">{stat.growth} from last month</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    stat.color === "green" ? "bg-green-100 text-green-600" :
                    stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                    stat.color === "purple" ? "bg-purple-100 text-purple-600" :
                    "bg-orange-100 text-orange-600"
                  }`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardStats;