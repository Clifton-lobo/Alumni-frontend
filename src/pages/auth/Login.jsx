import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/authSlice/authSlice.js";
import { toast } from "sonner";

const Login = () => {
  const initialState = { email: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ── Client-side validation ──
    if (!loginData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    if (!loginData.password) {
      toast.error("Please enter your password.");
      return;
    }

    dispatch(loginUser(loginData))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Logged in successfully!");
        // navigate based on role
        if (data.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/home");
        }
      })
      .catch((err) => {
        // err is already the string from rejectWithValue
        toast.error(err || "Login failed. Please try again.");
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
        Login to Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;