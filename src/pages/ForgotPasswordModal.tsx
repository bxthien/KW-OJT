import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  if (!showModal) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://lms-ai-kr.netlify.app/change-password",
      });

      if (error) {
        console.error("Error sending reset email:", error.message);
        alert("Failed to send reset email. Please try again.");
        return;
      }

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setEmail("");
      }, 3000);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-10 rounded-lg shadow-md w-full max-w-2xl transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {!isSuccess ? (
          <>
            <div className="flex items-center mb-4">
              <img
                src="https://img.icons8.com/?size=100&id=eBEo6FOQZ3v4&format=png&color=000000"
                alt="Forgot Password Icon"
                className="w-8 h-8 mr-3"
              />
              <h1 className="text-3xl font-bold text-black">
                Forgot your password?
              </h1>
            </div>

            <p className="text-gray-600 mb-6">
              Enter your email below to receive a password reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg"
                  required
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <button
              onClick={onClose}
              className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </>
        ) : (
          <div
            className="text-center animate-fade-out"
            style={{ animationDelay: "2.5s" }}
          >
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              SUCCESS TO SEND EMAIL!
            </h1>
            <p className="text-gray-600">
              Please check your inbox for the password reset link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
