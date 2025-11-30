import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice/authSlice.js";
import {toast} from "sonner"


const Login = () => {

   const intialState ={
     email:'',
     password:'' 
    }

    const [loginData,setloginData] = useState(intialState);
    const dispatch = useDispatch();
 
    const handleSubmit =(event)=>{
     event.preventDefault();
     dispatch(loginUser(loginData))
       .unwrap()
       .then((data) => {
         toast.success(data.message);
       })
       .catch((error) => {
         toast.error(error);
       });
   
  
    }

  return (

    <div>
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
        Login to Your Account
      </h2>
    <div >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
             type="email"
             name="email"
             value={loginData.email}
             onChange={(e) => setloginData({ ...loginData, [e.target.name]: e.target.value })}
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
           value={loginData.password}
           onChange={(e) => setloginData({ ...loginData, [e.target.name]: e.target.value })}
           placeholder="Enter your password"
           className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
         /> 
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/auth/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
        </div>

  );
};

export default Login;
