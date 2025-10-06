import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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

      // ✅ Save both ID and full user data for consistency
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userData", JSON.stringify(user));

      toast.success(`Welcome back, ${user.name}!`);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.warn("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/bg.jpg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          New user?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
