import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authSlice/authSlice.js";
import { toast } from "sonner";

const STREAMS = ["CSE", "MECH", "EEE", "ECE", "CIVIL", "IT", "CHEM", "AERO", "BIOTECH", "MBA"];

const Register = () => {
  const initialState = {
    fullname: "",
    username: "",
    batch: "",
    stream: "",
    phoneno: "",
    email: "",
    password: "",
  };

  const [registerData, setRegisterData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // ── Client-side validation ──
  const validate = () => {
    const { fullname, username, batch, stream, phoneno, email, password } = registerData;

    if (!fullname.trim()) { toast.error("Full name is required."); return false; }
    if (!username.trim()) { toast.error("Username is required."); return false; }
    if (username.trim().length < 3) { toast.error("Username must be at least 3 characters."); return false; }

    const batchNum = Number(batch);
    if (!batch || isNaN(batchNum) || batchNum < 1900 || batchNum > 2100) {
      toast.error("Please enter a valid graduation year (1900–2100).");
      return false;
    }

    if (!stream) { toast.error("Please select your stream."); return false; }
    if (!STREAMS.includes(stream)) { toast.error("Invalid stream selected."); return false; }

    if (!phoneno.trim()) { toast.error("Phone number is required."); return false; }
    if (!/^\d{10}$/.test(phoneno.trim())) { toast.error("Phone number must be exactly 10 digits."); return false; }

    if (!email.trim()) { toast.error("Email is required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error("Please enter a valid email address."); return false; }

    if (!password) { toast.error("Password is required."); return false; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return false; }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch(registerUser(registerData))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Registration successful!");
        navigate("/auth/login");
      })
      .catch((err) => {
        // err is already the extracted string from rejectWithValue
        toast.error(err || "Registration failed. Please try again.");
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-indigo-700 mb-4">
        Create a New Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={registerData.fullname}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Graduation Year</label>
          <input
            type="number"
            name="batch"
            value={registerData.batch}
            onChange={handleChange}
            min="1900"
            max="2100"
            step="1"
            placeholder="Enter your passout year"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Stream</label>
          <div className="relative">
            <select
              name="stream"
              value={registerData.stream}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-transparent border border-gray-600 text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled className="text-gray-400 bg-gray-900">Select your stream</option>
              {STREAMS.map((s) => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Phone Number</label>
          <input
            type="text"
            name="phoneno"
            value={registerData.phoneno}
            onChange={handleChange}
            placeholder="Enter your 10-digit phone number"
            maxLength={10}
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
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
            value={registerData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registering…" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;