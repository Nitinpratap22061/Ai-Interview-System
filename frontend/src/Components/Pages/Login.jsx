import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../redux/action";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((store) => store.authReducer.isAuth);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent form refresh
    const userObj = { email, password };
    dispatch(LoginUser(userObj, navigate)); // make sure LoginUser hits your backend
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto m-36">
      <h1 className="text-3xl font-bold mb-4">Please Login</h1>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Your email
        </label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="name@flowbite.com"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Your password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        />
      </div>

      <div className="flex items-start mb-5">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 border border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
      >
        Submit
      </button>
    </form>
  );
};
