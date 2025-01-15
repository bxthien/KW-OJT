import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons"; // Ant Design 아이콘 가져오기

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`flex flex-col ${
        isOpen ? "w-60" : "w-24"
      } bg-blue-100 text-black p-4 transition-all duration-300 h-full rounded-lg shadow-lg justify-between`}
    >
      <div className="flex flex-col">
        <div
          className={`flex items-center  ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center space-x-2">
            <img
              src="https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000"
              alt="Hotdog Logo"
              className={`w-8 h-8 ${isOpen ? "block" : "hidden"}`}
            />
            <h1 className={`text-2xl font-bold ${isOpen ? "block" : "hidden"}`}>
              HOTDOG
            </h1>
          </div>

          <div
            onClick={toggleSidebar}
            className="flex items-center w-12 h-12 justify-center rounded-full hover:bg-blue-300 transition duration-300"
          >
            {isOpen ? (
              <DoubleLeftOutlined className="text-xl" />
            ) : (
              <DoubleRightOutlined className="text-xl" />
            )}
          </div>
        </div>
        <nav className="mt-6 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center py-3 px-3 rounded-lg ${
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
              `flex items-center py-3 px-3 rounded-lg ${
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
            to="/chapters"
            className={({ isActive }) =>
              `flex items-center py-3 px-3 rounded-lg ${
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
            to="/lectures"
            className={({ isActive }) =>
              `flex items-center py-3 px-3 rounded-lg ${
                isActive ? "bg-blue-300" : "bg-blue-100"
              } hover:bg-blue-300 transition-colors`
            }
          >
            <img
              src="https://img.icons8.com/?size=100&id=85767&format=png&color=000000"
              alt="Settings Icon"
              className="w-6 h-6 mr-2"
            />
            <span className={`${isOpen ? "block" : "hidden"}`}>Lectures</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center py-3 px-3 rounded-lg ${
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
              `flex items-center py-3 px-3 rounded-lg ${
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
      </div>
      <div className="flex items-center justify-center w-full">
        <NavLink
          to="/logout"
          className="flex items-center justify-center w-full py-3 px-3 rounded-lg bg-blue-100 hover:bg-blue-300 transition-colors"
        >
          <img
            src="https://img.icons8.com/?size=100&id=82751&format=png&color=000000"
            alt="Logout Icon"
            className="w-6 h-6 mr-2"
          />
          <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
