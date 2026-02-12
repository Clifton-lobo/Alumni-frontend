import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/authSlice/authSlice.js";
import {toast} from "sonner"

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
            Gtaduation year
          </label>
          <input
            type="text"
            name="batch"
            value={registerData.batch}
            onChange={handleChange}
            placeholder="Enter your Batch (passout year)"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Stream
          </label>
          <input
            type="text"
            name="stream"
            value={registerData.stream}
            onChange={handleChange}
            placeholder="Enter your stream"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
