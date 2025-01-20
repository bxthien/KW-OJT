import React, { useState, useEffect, useRef } from "react";
import { Input, Modal, notification } from "antd";
import { supabase } from "../supabase/supabaseClient";
import { getCurrentUser } from "../supabase/authService";

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+1"); // 국가 번호 상태
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dots, setDots] = useState<string>("");

  const [api, contextHolder] = notification.useNotification();
  const birthdayInputRef = useRef<HTMLInputElement>(null);

  // 현재 로그인한 유저 ID 저장
  const [userId, setUserId] = useState<string | null>(null);

  // 비밀번호 변경 모달 관련 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // 점 애니메이션 효과 설정
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [isLoading]);

  // 유저 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("No user is logged in.");

        setUserId(user.id);

        const { data, error } = await supabase
          .from("users")
          .select("user_name, email, contact, date_of_birth, age")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error.message);
          return;
        }

        setName(data.user_name || "");
        setEmail(data.email || "");
        setContact(data.contact || "");
        setBirthday(data.date_of_birth || "");
        setAge(data.age || null);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordModal = () =>
    setIsPasswordModalOpen(!isPasswordModalOpen);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      api.error({
        message: "Password Mismatch",
        description: "New password and confirm password do not match.",
      });
      return;
    }

    try {
      // 1. 현재 비밀번호 확인
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email, // 유저의 이메일 (이미 상태로 관리 중)
        password: currentPassword, // 사용자가 입력한 현재 비밀번호
      });

      if (signInError) {
        console.error(
          "Current password verification failed:",
          signInError.message
        );
        api.error({
          message: "Invalid Current Password",
          description: "The current password you entered is incorrect.",
        });
        return;
      }

      // 2. 새 비밀번호 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError.message);
        api.error({
          message: "Password Update Failed",
          description: "An error occurred while updating the password.",
        });
        return;
      }

      api.success({
        message: "Password Changed Successfully",
        description: "Your password has been updated!",
      });
      handlePasswordModal(); // 모달 닫기
    } catch (err) {
      console.error("Unexpected error while changing password:", err);
      api.error({
        message: "Password Update Error",
        description: "Something went wrong while changing the password.",
      });
    }
  };

  // 전화번호 입력 시 자동 하이픈 추가
  const handleContactChange = (value: string) => {
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    let formattedContact = onlyNumbers;

    if (onlyNumbers.length <= 3) {
      formattedContact = onlyNumbers;
    } else if (onlyNumbers.length <= 7) {
      formattedContact = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    } else {
      formattedContact = `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(
        3,
        7
      )}-${onlyNumbers.slice(7)}`;
    }

    setContact(formattedContact);
  };

  // 생년월일 입력 시 나이 자동 계산
  const handleBirthdayChange = (value: string) => {
    setBirthday(value);

    if (value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge >= 0 ? calculatedAge : null);
    } else {
      setAge(null);
    }
  };

  // 프로필 수정 저장
  const handleSaveChanges = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          user_name: name,
          contact,
          date_of_birth: birthday,
          age,
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating user data:", error.message);
        alert("Failed to save changes.");
        return;
      }

      setIsEditing(false);
      api.success({
        message: "Profile Changes Saved",
        description: "Your profile has been successfully saved!",
        placement: "topRight",
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("An error occurred while saving your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // 생년월일 필드 클릭 시 달력 표시
  const handleBirthdayClick = () => {
    if (birthdayInputRef.current) {
      birthdayInputRef.current.showPicker();
    }
  };

  return (
    <div
      className={`w-full flex justify-center items-center bg-gray-100 ${
        isLoading ? "pointer-events-none" : ""
      }`}
    >
      {contextHolder}
      <div className="w-full p-8 bg-white rounded-xl shadow-lg mt-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Profile Page
        </h2>
        <div className="grid grid-cols-2 w-full justify-center items-center">
          <div
            className="flex flex-col items-center mb-10 relative w-full"
            style={{
              backgroundImage: `url('https://cdn.pixabay.com/photo/2024/01/17/11/56/dog-8514297_1280.png')`, // 배경 이미지 URL
              backgroundSize: "cover", // 배경 이미지 크기 조정
              backgroundPosition: "center", // 배경 이미지 위치
              borderRadius: "1rem", // 둥근 모서리 설정
              padding: "2rem", // 내부 여백
            }}
          >
            <img
              src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
              style={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)", // 음영 효과
              }}
            />
            <p className="text-gray-500 text-sm">Nice to meet you everyone!</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing || isLoading}
                className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isEditing && !isLoading ? "" : "bg-gray-200"
                }`}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing || isLoading}
                className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isEditing && !isLoading ? "" : "bg-gray-200"
                }`}
                placeholder="Enter your email"
              />
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Contact
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={!isEditing || isLoading}
                  placeholder="+1"
                  maxLength={4}
                  className={`w-20 p-4 text-center bg-gray-50 text-gray-800 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isEditing && !isLoading ? "" : "bg-gray-200"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={contact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  disabled={!isEditing || isLoading}
                  maxLength={13}
                  className={`flex-1 p-4 bg-gray-50 text-gray-800 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isEditing && !isLoading ? "" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Birthday */}
            <div onClick={handleBirthdayClick} className="cursor-pointer">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Birthday
              </label>
              <input
                ref={birthdayInputRef}
                type="date"
                value={birthday}
                onChange={(e) => handleBirthdayChange(e.target.value)}
                disabled={!isEditing || isLoading}
                className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isEditing && !isLoading ? "" : "bg-gray-200"
                }`}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age || ""}
                disabled
                className="w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <div className="flex flex-col justify-center items-center w-full">
                <p
                  onClick={handlePasswordModal}
                  className="text-center text-blue-500 underline cursor-pointer mb-6 hover:text-blue-600 transition"
                >
                  Change Password
                </p>

                {/* Buttons */}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-300"
                    disabled={isLoading}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleSaveChanges}
                      className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-500 transition duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? `Saving Profile${dots}` : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
        }
        visible={isPasswordModalOpen}
        onOk={handlePasswordChange}
        onCancel={handlePasswordModal}
        okText="Change Password"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-blue-600 hover:bg-blue-500 text-white font-semibold",
        }}
        cancelButtonProps={{
          className: "hover:text-blue-600 font-semibold",
        }}
        className="rounded-lg overflow-hidden"
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              <span className="text-red-500">* </span>Current Password
            </label>
            <Input.Password
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              prefix={<i className="ri-lock-line text-gray-400"></i>}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              <span className="text-red-500">* </span>New Password
            </label>
            <Input.Password
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              prefix={<i className="ri-key-line text-gray-400"></i>}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              <span className="text-red-500">* </span>Confirm New Password
            </label>
            <Input.Password
              placeholder="Re-enter the new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              prefix={<i className="ri-check-line text-gray-400"></i>}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
