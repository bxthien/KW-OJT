import React, { useState } from "react";
import { loginUser } from "../supabase/authService";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import signInImage from "../assets/studentimg.png";
import ForgotPasswordModal from "./ForgotPasswordModal";
import RegisterPage from "./Register";

const LoginPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<"register" | "forgot" | null>(
    null
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const openModal = (modalType: "register" | "forgot") =>
    setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { user } = await loginUser(email, password);

      if (!user) {
        setError("Login failed. Please check your email and password.");
        return;
      }

      // users ���̺����� status�� is_admin �� Ȯ��
      const { data, error: profileError } = await supabase
        .from("users")
        .select("status, is_admin")
        .eq("email", email)
        .single();

      if (profileError || !data) {
        setError("Access denied.");
        return;
      }

      // status �Ǵ� is_admin�� false�� ���? ���� ����
      if (!data.status || !data.is_admin) {
        setError("Access denied. You do not have sufficient permissions.");
        return;
      }

      navigate("/", { state: { notification: "Login Successful!" }, replace: true });


    } catch (err: any) {
      setError(
        err.message || "Login failed. Please check your email and password."
      );
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-12">
        <h1 className="text-5xl font-extrabold text-black mb-2">Sign in to</h1>
        <h2 className="text-3xl font-extrabold text-black mb-2">HOTDOG LMS!</h2>
        <p className="mt-4 text-gray-600">
          If you don't have an account register <br />
          You can{" "}
          <button
            onClick={() => openModal("register")}
            className="text-indigo-600 font-semibold"
          >
            Register here!
          </button>
        </p>
        <img src={signInImage} alt="Sign in" className="mt-10 w-64" />
      </div>

      <div className="flex flex-1 flex-col justify-center items-center bg-gray-50 text-black p-12">
        <div className="flex items-start mb-4">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            Login to HOTDOG LMS!
          </h2>
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
