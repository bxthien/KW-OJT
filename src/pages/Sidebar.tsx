import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons"; // Ant Design 아이콘 가져오기

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${
        isOpen ? "w-72" : "w-24"
      } bg-blue-100 text-black h-screen p-4 transition-all duration-300`}
    >
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

        <button
          onClick={toggleSidebar}
          className="flex items-center w-12 justify-center h-12 rounded-full hover:bg-blue-300 transition duration-300"
        >
          {isOpen ? (
            <DoubleLeftOutlined className="text-xl" />
          ) : (
            <DoubleRightOutlined className="text-xl" />
          )}
        </button>
      </div>
      <nav className="mt-6 space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=TPXhNjRudwmY&format=png&color=000000"
            alt="Dashboard Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg ${
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
          to="/chapter"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=85767&format=png&color=000000"
            alt="Settings Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Chapters</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg ${
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
          to="/profile"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-300" : "bg-blue-100"
            } hover:bg-blue-300 transition-colors`
          }
        >
          <img
            src="https://img.icons8.com/?size=100&id=tiTDCgtmOFZL&format=png&color=000000"
            alt="Communication Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;