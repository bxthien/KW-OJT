import React, { useEffect, useState } from "react";
import { loginUser } from "../supabase/authService";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import RegisterPage from "./Register";
import BackgroundImage from "../assets/招聘矢量插画人物场景插画招聘1100924黑与白-01 copy 1.png";

const LoginPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"register" | "forgot" | null>(
    null
  );
  const [email, setEmail] = useState<string>("on@naver.com");
  const [password, setPassword] = useState<string>("asdf1234");
  const [error, setError] = useState<string | null>(null);
  const [dogPosition, setDogPosition] = useState(-200);
  const [currentDog, setCurrentDog] = useState(1); // 현재 보여지는 강아지 이미지 번호
  const navigate = useNavigate();

  const openModal = (modalType: "register" | "forgot") =>
    setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const dogInterval = setInterval(() => {
      setDogPosition((prev) => (prev > window.innerWidth ? -200 : prev + 10));
      setCurrentDog((prev) => (prev === 1 ? 2 : 1)); // 이미지 번갈아 표시
    }, 140);

    return () => {
      clearInterval(dogInterval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { user } = await loginUser(email, password);

      if (!user) {
        setError("Login failed. Please check your email and password.");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("users")
        .select("status, is_admin")
        .eq("email", email)
        .single();

      if (profileError || !data) {
        setError("Access denied.");
        return;
      }

      if (!data.status || !data.is_admin) {
        setError("Access denied. You do not have sufficient permissions.");
        return;
      }

      navigate("/", { state: { notification: "Login Successful!" } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message || "Login failed. Please check your email and password."
        );
        console.error("Login error:", err);
      } else {
        setError("An unexpected error occurred.");
        console.error("Unknown error:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section: Login Form */}
      <div className="w-1/4 flex flex-col justify-center items-start bg-white p-12 shadow-lg">
        {/* Header */}
        <div className="w-full">
          <div className="flex items-center mb-4">
            <img
              src="https://img.icons8.com/?size=100&id=7690&format=png&color=000000"
              alt="Login Icon"
              className="w-8 h-8 mr-3"
            />
            <h1 className="text-4xl font-bold text-black">LOGIN</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Enter your account details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
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

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <button
              type="button"
              onClick={() => openModal("forgot")}
              className="text-indigo-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>

          {/* Register Link */}
          <p className="mt-6 text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => openModal("register")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register here!
            </button>
          </p>
        </form>
      </div>

      {/* Right Section: Image */}
      <div className="w-3/4 relative bg-blue-100 text-white p-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0C50 100 200 50 300 150C400 250 500 200 600 300C700 400 800 350 900 450C1000 550 1100 500 1200 600L1200 0L0 0Z"
              fill="blue"
              opacity="0.6"
            />
            <path
              d="M 0 500 C 200 400 400 600 600 500 C 800 400 1000 600 1200 600 L 1200 800 L 0 800 Z"
              fill="blue"
              opacity="0.5"
            />
          </svg>
        </div>
        <div className="absolute top-10 left-10 md:top-20 md:left-20 lg:top-25 lg:left-25">
          <h1 className="text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Welcome to
          </h1>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">HOTDOG LMS!</h2>
          <p className="text-xl lg:text-2xl opacity-90">
            Login to access your account
          </p>
        </div>

        <img
          src={BackgroundImage}
          alt="Sign in"
          className="absolute bottom-0 right-0 w-[600px] h-auto"
        />
      </div>
      {/* Dog Animation */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
        <img
          src={
            currentDog === 1
              ? "https://img.icons8.com/?size=100&id=Mgul1VWKiLPN&format=png&color=000000"
              : "https://img.icons8.com/?size=100&id=OzaDjT66VCbV&format=png&color=000000"
          }
          alt="Running Dog"
          style={{
            position: "absolute",
            bottom: 0,
            left: `${dogPosition}px`,
            width: "100px",
          }}
        />
      </div>

      {/* Modals */}
      {activeModal === "register" && (
        <RegisterPage isOpen={true} onClose={closeModal} />
      )}
      {activeModal === "forgot" && (
        <ForgotPasswordModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default LoginPage;
