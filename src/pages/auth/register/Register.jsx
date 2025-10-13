import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar/Navbar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warn("All fields are required!");
      return;
    }

    try {
      // Check if user already exists
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        toast.warning("User with this email already exists!");
        return;
      }

      const createdAt = new Date().toISOString();

      const newUser = {
        name,
        email,
        password,
        role: "user",
        wishlist: [],
        cart: [],
        orders: [],
        isBlock: false,
        createdAt,
      };

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      localStorage.setItem("userId", data.id);
      toast.success("Registration successful! 🎉");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.warn("Something went wrong! Please try again later.");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />

      {/* Background with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/assets/images/bg.jpg')" }}
      ></div>

      <div className="relative flex flex-1 justify-center items-center px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Create an Account</h2>
          <p className="text-center text-gray-600">
            Join us and start your journey today ✨
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition"
              />
            </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold p-3 rounded-xl hover:bg-green-600 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-green-500 font-medium hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
