import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        toast.error("User not found");
        return;
      }

      const user = users[0];

      if (user.password !== password) {
        toast.error("Incorrect password");
        return;
      }

      
      // Save user info
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("isBlock", user.isBlock);
      
      if(user.isBlock){
        localStorage.clear("userId")
        toast.error(`Hey ${user.name}, You are Blocked!`);
      }

      if(!user.isBlock){
        toast.success(`Welcome back, ${user.name}!`);
      }
      if (user.role === "admin") navigate("/admin");
      else  navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.warn("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/assets/images/bg.jpg')" }}
      ></div>

      <div className="relative flex flex-1 justify-center items-center px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h2>
          <p className="text-center text-gray-600">Login to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold p-3 rounded-xl hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            New user?{" "}
            <Link to="/register" className="text-green-500 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
