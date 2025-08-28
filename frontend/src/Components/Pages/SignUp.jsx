import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../redux/action";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const initialData = {
    userImage: "",
    username: "",
    email: "",
    password: "",
  };

  const [registerUser, setRegisterUser] = useState(initialData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!registerUser.username || !registerUser.email || !registerUser.password) {
      alert("All fields are required!");
      return;
    }
    dispatch(RegisterUser(registerUser));
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-3 m-20">
      <h1 className="text-lg font-bold mb-4">CREATE ACCOUNT</h1>

      <label htmlFor="user_avatar" className="block mb-2 text-sm font-medium text-gray-900">
        Upload user profile
      </label>
      <input
        id="user_avatar"
        name="userImage"
        type="text"
        value={registerUser.userImage}
        onChange={handleChange}
        placeholder="Enter user image link"
        className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
      />

      <div className="mb-5">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
          User Name
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={registerUser.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
          Your Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={registerUser.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
          Your password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={registerUser.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
        />
      </div>

      <div className="flex items-start mb-5">
        <input id="terms" type="checkbox" required className="w-4 h-4 border border-gray-300 rounded" />
        <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900">
          I agree with the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            terms and conditions
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        Register new account
      </button>
    </form>
  );
};
