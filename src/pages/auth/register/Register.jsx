import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      // Check if user already exists
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        alert("User with this email already exists!");
        return;
      }

      // Generate timestamp for createdAt
      const createdAt = new Date().toISOString();

      // Default user object as per your db.json structure
      const newUser = {
        name,
        email,
        password,
        role: "user",
        wishlist: [],
        cart: [],
        orders: [],
        isBlock: false,
        createdAt
      };

      // POST request to JSON server
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      // Save the userId in localStorage
      localStorage.setItem("userId", data.id);

      alert("Registration successful! 🎉 Your ID: " + data.id);
      navigate("/login");

    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong! Please try again later.");
    }
  }

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/bg.jpg')" }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
