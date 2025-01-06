// src/pages/LoginPage.tsx
import React, { useState } from "react";
import signInImage from "../assets/studentimg.png"; // 이미지 경로 추가
import RegisterModal from "./RegisterPage"; // RegisterModal 추가
const LoginPage: React.FC = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-12">
        <h1 className="text-5xl font-extrabold text-black mb-2">Sign in to</h1>
        <h2 className="text-3xl font-extrabold text-black mb-2">HOTDOG LMS</h2>
        <p className="mt-4 text-gray-600">
          If you don’t have an account register <br />
          You can{" "}
          <button
            onClick={openRegisterModal}
            className="text-indigo-600 font-semibold"
          >
            Register here!
          </button>
        </p>
        <img src={signInImage} alt="Sign in" className="mt-10 w-64" />
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-50 p-12">
        <h3 className="text-2xl font-bold mb-6">Sign in</h3>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-500"
              required
            />
          </div>
          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-indigo-600">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-600">or continue with</p>
        <div className="flex space-x-6 mt-4">
          <button className="text-white rounded-full hover:shadow-lg">
            <img
              src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="text-white rounded-full hover:shadow-lg">
            <img
              src="https://img.icons8.com/?size=100&id=85906&format=png&color=000000"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
          <button className="text-white rounded-full hover:shadow-lg">
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
      />
    </div>
  );
};

export default LoginPage;
