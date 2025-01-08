import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  // 사이드바 상태 관리 (접기/펼치기)
  const [isOpen, setIsOpen] = useState(true);

  // PNG 이미지 링크 설정
  const openIconUrl =
    "https://img.icons8.com/?size=100&id=100002&format=png&color=000000"; // 사이드바 펼치기 아이콘
  const closeIconUrl =
    "https://img.icons8.com/?size=100&id=15828&format=png&color=000000"; // 사이드바 접기 아이콘

  // 사이드바 접기/펼치기 토글
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${
        isOpen ? "w-72" : "w-24"
      } bg-blue-100 text-black h-screen p-4 transition-all duration-300`}
    >
      {/* 사이드바 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000"
            alt="Hotdog Logo"
            className={`w-8 h-8 ${isOpen ? "block" : "hidden"}`}
          />
          <h1 className={`text-lg font-bold ${isOpen ? "block" : "hidden"}`}>
            HOTDOG
          </h1>
        </div>

        {/* 접기/펼치기 버튼 */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-blue-200 rounded-full transition duration-300"
        >
          <img
            src={isOpen ? closeIconUrl : openIconUrl}
            alt="Toggle Icon"
            className={`${
              isOpen ? "w-6 h-6" : "w-8 h-8"
            } transition-all duration-300`}
          />
        </button>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="mt-6 space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=16134&format=png&color=000000"
            alt="Dashboard Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=85927&format=png&color=000000"
            alt="Courses Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Courses</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=82751&format=png&color=000000"
            alt="Users Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Users</span>
        </NavLink>

        <NavLink
          to="/communication"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=a8cZMQaCOiz0&format=png&color=000000"
            alt="Communication Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>
            Communication
          </span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=82535&format=png&color=000000"
            alt="Settings Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
