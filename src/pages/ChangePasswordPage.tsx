import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 배경 이미지 URL 링크
  const backgroundImageUrl =
    "https://cdn.pixabay.com/photo/2022/11/06/04/57/cat-7573258_1280.png"; // 원하는 PNG 이미지 링크로 변경하세요.

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        console.error("Error updating password:", error.message);
        alert("Failed to update password. Please try again.");
        return;
      }

      alert("Password updated successfully. You can now log in with your new password.");
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {/* 블러 처리된 카드 */}
      <div className="bg-black bg-opacity-20 backdrop-blur-lg-10 rounded-lg shadow-lg p-10 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Set a password
        </h1>
        <p className="text-black font-bold text-sm text-center mb-6">
          Your previous password has been reset. Please set a new password for
          your account.
        </p>

        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Create Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 bg-white bg-opacity-20 text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">
              Re-enter Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-white bg-opacity-20 text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Set password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
