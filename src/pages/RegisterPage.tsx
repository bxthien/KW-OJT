import React, { useState, useEffect } from "react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterPage: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // 모달 애니메이션 효과를 위한 상태
  const [showModal, setShowModal] = useState<boolean>(false);

  // 모달 열리고 닫힐 때 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300); // 닫힐 때 300ms 후에 DOM에서 제거
    }
  }, [isOpen]);

  // 모달 외부 클릭 시 닫기 처리
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert(`Username: ${username}, Email: ${email}, Password: ${password}`);
    onClose();
  };

  // 조건부 렌더링: showModal이 false면 아무것도 렌더링하지 않음
  if (!showModal) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-10 rounded-lg shadow-md w-full max-w-md transform transition-transform duration-300 ${
          isOpen ? "animate-scale-in" : "animate-scale-out"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center mb-4">
          <img
            src="https://img.icons8.com/?size=100&id=86120&format=png&color=000000"
            alt="User Icon"
            className="w-8 h-8 mr-3"
          />
          <h1 className="text-3xl font-bold text-black">Create an Account</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Already have an account?{" "}
          <button onClick={onClose} className="text-indigo-600">
            Sign in
          </button>
        </p>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Register
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
