import React, { useState } from "react";
import { loginUser } from "../supabase/authService";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./Register";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"register" | "forgot" | null>(
    null
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Modal Handlers
  const openModal = (modalType: "register" | "forgot") =>
    setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  // Form Submission Handler
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
    } catch (err) {
      setError("Login failed. Please check your email and password.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side - Image */}
      <div className="w-full md:w-2/3 h-64 md:h-screen">
        <img
          src="https://yosigo.es/site/assets/files/4204/1.jpg"
          alt="Welcome IMG"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/3 bg-gray-50 text-black p-12 flex flex-col justify-center items-center">
        <div className="flex items-start mb-4">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            Login to HOTDOG LMS!
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-l">
          Login to access your HOTDOG LMS account!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {error && (
            <p className="text-red-500 bg-red-100 p-4 rounded-lg text-sm mb-4">
              {error}
            </p>
          )}
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

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => openModal("forgot")}
              className="text-indigo-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 mb-6 text-l">
          Don't have an account?{" "}
          <button
            onClick={() => openModal("register")}
            className="text-indigo-600 font-semibold"
          >
            Register here!
          </button>
        </p>
      </div>

      {/* Modals */}
      {activeModal === "register" && (
        <RegisterModal isOpen={true} onClose={closeModal} />
      )}
      {activeModal === "forgot" && (
        <ForgotPasswordModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default LoginPage;
