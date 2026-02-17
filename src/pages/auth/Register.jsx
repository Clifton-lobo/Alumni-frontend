import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/authSlice/authSlice.js";
import { toast } from "sonner"

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit called with:", registerData);

    dispatch(registerUser(registerData))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Registration successful!");
        navigate("/auth/login");
      })
      .catch((err) => {
        const backendMessage =
          err?.response?.data?.message || "Registration failed. Please try again.";
        toast.error(backendMessage);
      });
  };


  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-indigo-700 mb-4">
        Create a New Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Full Name
          </label>
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
          <label className="block text-sm font-medium text-gray-600">
            User Name
          </label>
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
          <label className="block text-sm font-medium text-gray-600">
            Graduation year
          </label>
          <input
            type="number"
            name="batch"
            value={registerData.batch}
            onChange={handleChange}
            min="1900"
            max="2100"
            step="1"
            placeholder="Enter your Batch (passout year)"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Stream
          </label>

          <div className="relative">
            <select
              name="stream"
              value={registerData.stream}
              onChange={handleChange}
              required
              className="
        w-full mt-1 p-3 rounded-lg
        bg-transparent
        border border-gray-600
        text-gray-200
        appearance-none
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500
        focus:border-indigo-500
      "
            >
              <option value="" disabled className="text-gray-400 bg-gray-900">
                Select your stream
              </option>

              <option value="CSE" className="bg-gray-900">CSE</option>
              <option value="MECH" className="bg-gray-900">MECH</option>
              <option value="EEE" className="bg-gray-900">EEE</option>
              <option value="ECE" className="bg-gray-900">ECE</option>
              <option value="CIVIL" className="bg-gray-900">CIVIL</option>
              <option value="IT" className="bg-gray-900">IT</option>
              <option value="CHEM" className="bg-gray-900">CHEM</option>
              <option value="AERO" className="bg-gray-900">AERO</option>
              <option value="BIOTECH" className="bg-gray-900">BIOTECH</option>
              <option value="MBA" className="bg-gray-900">MBA</option>
            </select>

            {/* Custom arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-600">
            Phone no.
          </label>
          <input
            type="text"
            name="phoneno"
            value={registerData.phoneno}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
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
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            placeholder="Enter a password"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Register
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


