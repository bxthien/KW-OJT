import React, { useState, useEffect } from "react";
import { registerUser } from "../supabase/authService";
import { Modal, Result } from "antd";

const HOTDOG_IMAGE =
  "https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterPage: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [hotdogs, setHotdogs] = useState<{ id: number; left: number }[]>([]); // 핫도그 비 상태
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false); // 성공 모달

  // 핫도그 비 애니메이션
  useEffect(() => {
    if (success) {
      let counter = 0;
      const interval = setInterval(() => {
        setHotdogs((prev) => [
          ...prev,
          { id: counter++, left: Math.random() * 100 },
        ]);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [success]);

  // 오래된 핫도그 제거
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setHotdogs((prev) => prev.slice(-50));
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const user = await registerUser(email, password, { username });
      console.log("User registered successfully:", user);

      // 회원가입 성공 처리
      setSuccess(true);
      setShowSuccessModal(true);

      // 5초 후 모달 및 핫도그 비 종료
      setTimeout(() => {
        setSuccess(false);
        setShowSuccessModal(false);
        setHotdogs([]); // 핫도그 비 초기화
        onClose();
      }, 5000);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during registration.");
      } else {
        setError("An error occurred during registration.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      {/* 핫도그 비 애니메이션 */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {hotdogs.map((hotdog) => (
          <img
            key={hotdog.id}
            src={HOTDOG_IMAGE}
            alt="Hotdog"
            className="absolute animate-hotdog"
            style={{
              top: "-50px",
              left: `${hotdog.left}%`,
              animationDuration: "3s",
              width: "40px",
              height: "auto",
            }}
          />
        ))}
      </div>

      {/* 성공 모달 */}
      <Modal open={showSuccessModal} footer={null} centered closable={false}>
        <Result
          status="success"
          title="Registration Successful!"
          subTitle="Your account has been created successfully. Welcome to our platform!"
        />
      </Modal>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-black mb-4">
            Create an Account
          </h1>
          <p className="text-gray-600 mb-6">
            Already have an account?{" "}
            <button onClick={onClose} className="text-indigo-600">
              Sign in
            </button>
          </p>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              Register
            </button>
          </form>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* 스타일 추가 */}
      <style>{`
        @keyframes hotdogFall {
          0% {
            transform: translateY(-10%);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .animate-hotdog {
          animation-name: hotdogFall;
          animation-timing-function: linear;
          animation-iteration-count: 1;
        }
      `}</style>
    </>
  );
};

export default RegisterPage;
