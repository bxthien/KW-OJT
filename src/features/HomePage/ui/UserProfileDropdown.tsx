import React, { useState, useRef, useEffect } from "react";
import ProfileCard from "./ProfileCard";

const UserProfileDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setShowProfileCard(false); // 드롭다운 닫힐 때 ProfileCard도 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setShowProfileCard(false);
  };

  const showProfile = () => {
    setShowProfileCard(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 프로필 이미지 및 사용자 이름 */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
          alt="Profile"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="font-medium text-black">Username</span>
      </div>

      {/* 드롭다운 메뉴 */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
          {!showProfileCard ? (
            <ul className="space-y-2">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                onClick={showProfile}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                onClick={() => console.log("Logout")}
              >
                Logout
              </li>
            </ul>
          ) : (
            <ProfileCard username={""} />
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
