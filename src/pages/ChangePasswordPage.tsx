import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Result, Modal } from "antd";
import Headache from "../assets/man-with-headache_2009335-removebg-preview 1.png";

const HOTDOG_IMAGE =
  "https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000";

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hotdogs, setHotdogs] = useState<{ id: number; left: number }[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false); // 비밀번호 변경 성공 여부

  // 핫도그 비 애니메이션
  useEffect(() => {
    if (passwordChanged) {
      let counter = 0;
      const interval = setInterval(() => {
        setHotdogs((prev) => [
          ...prev,
          { id: counter++, left: Math.random() * 100 },
        ]);
      }, 200);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }
  }, [passwordChanged]);

  // 핫도그 비 오래된 항목 제거
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setHotdogs((prev) => prev.slice(-50)); // 최근 50개만 유지
    }, 5000);

    return () => clearInterval(cleanupInterval); // 컴포넌트 언마운트 시 정리
  }, []);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Error updating password:", error.message);
        alert("Failed to update password. Please try again.");
        return;
      }

      // 비밀번호 변경 성공 처리
      setPasswordChanged(true); // 핫도그 비 시작
      setShowSuccessModal(true); // 모달 표시
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

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

      {/* 알림 */}
      {showNotification && (
        <div className="absolute top-10 right-10 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Password updated successfully!
        </div>
      )}

      {/* 비밀번호 변경 카드 */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative z-10">
        <div className="flex justify-center mb-6">
          <img src={Headache} alt="Locker" className="h-20 w-20" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Set a New Password
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Your previous password has been reset. Please set a new password for
          your account.
        </p>

        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-white border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Re-enter Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-white border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Set Password"}
          </button>
        </form>
      </div>

      {/* 성공 모달 */}
      <Modal
        open={showSuccessModal}
        footer={null}
        centered
        closable={false} // 닫기 버튼 비활성화
        afterOpenChange={(open) => {
          if (open) {
            setTimeout(() => {
              window.close(); // 5초 후 페이지 닫기
            }, 5000);
          }
        }}
      >
        <Result
          status="success"
          title="Password Changed Successfully!"
          subTitle={[
            <span key="line1">You can now log in with your new password.</span>,
            <br key="break" />,
            <span key="line2">
              Please close and go back to the login page.
            </span>,
          ]}
        />
      </Modal>

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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-hotdog {
          animation-name: hotdogFall;
          animation-timing-function: linear;
          animation-iteration-count: 1;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordPage;
