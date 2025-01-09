import React, { useState } from "react";
import { loginUser } from "../supabase/authService";
import { useNavigate } from "react-router-dom";
import signInImage from "../assets/studentimg.png";
import RegisterModal from "./Register";

const LoginPage: React.FC = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { user } = await loginUser(email, password);
      if (user) {
        navigate("/", { state: { notification: "Login Successful!" } });
      } else {
        setError("Login failed. Please check your email and password.");
      }
    } catch (err: any) {
      setError("Login failed. Please check your email and password.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-12">
        <h1 className="text-5xl font-extrabold text-black mb-2">Sign in to</h1>
        <h2 className="text-3xl font-extrabold text-black mb-2">HOTDOG LMS!</h2>
        <p className="mt-4 text-gray-600">
          If you don't have an account register <br />
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
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-50 text-black p-12">
        {/* LOGIN */}
        <div className="flex items-start mb-4">
          <img
            src="https://img.icons8.com/?size=100&id=GEeJqVN0aRrU&format=png&color=000000"
            alt="Login Icon"
            className="w-8 h-8 ml-3 self-start"
          />
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-l">
          Login to access your HOTDOG LMS account!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
      />
    </div>
  );
};

export default LoginPage;
