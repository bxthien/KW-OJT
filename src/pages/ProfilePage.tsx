import React, { useState, useEffect, useRef } from "react";
import { notification } from "antd";

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dots, setDots] = useState<string>("");

  const [api, contextHolder] = notification.useNotification();
  const birthdayInputRef = useRef<HTMLInputElement>(null);

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

      // Adjust if the birthday hasn't occurred yet this year
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      // Age should be at least 0
      setAge(calculatedAge >= 0 ? calculatedAge : null);
    } else {
      setAge(null);
    }
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);

      api.open({
        message: "Profile Changes Saved",
        description: "Your profile has been successfully saved!",
        icon: (
          <img
            src="https://img.icons8.com/?size=100&id=Km6p04jJQ76d&format=png&color=000000"
            alt="Smile Icon"
            style={{
              width: 40,
              height: 50,
              marginRight: "50px",
            }}
          />
        ),
        placement: "topRight",
        duration: 3,
        className: "custom-notification",
      });
    }, 2000);
  };

  // 생년월일 필드 클릭 시 달력 표시
  const handleBirthdayClick = () => {
    if (birthdayInputRef.current) {
      birthdayInputRef.current.showPicker();
    }
  };

  return (
    <div
      className={`h-screen w-full flex justify-center items-center bg-gray-100 ${
        isLoading ? "pointer-events-none" : ""
      }`}
    >
      {contextHolder}
      <div className="max-w-3xl w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Profile Page
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <p className="text-gray-500 text-sm">Nice to meet you everyone!</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing || isLoading}
              className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isEditing && !isLoading ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing || isLoading}
              className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isEditing && !isLoading ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
              placeholder="Enter your email"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Contact
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => handleContactChange(e.target.value)}
              disabled={!isEditing || isLoading}
              maxLength={13}
              className={`w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isEditing && !isLoading ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
              placeholder="Enter your contact number"
            />
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
                isEditing && !isLoading ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Age - Disabled Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Age
            </label>
            <input
              type="number"
              value={age || ""}
              disabled
              className="w-full p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg"
              placeholder="Age is calculated automatically"
            />
          </div>
        </div>

        {/* Edit and Save Buttons */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-300"
            disabled={isLoading}
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSaveChanges}
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-500 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? `Saving Profile${dots}` : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
