import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
        Create a New Account
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Batch</label>
          <input
            type="text"
            placeholder="Enter your Batch(passout year)"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-600">Stream</label>
          <input
            type="text"
            placeholder="Enter your stream"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-600">Phone no.</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter a password"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
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
