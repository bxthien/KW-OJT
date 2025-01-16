import ChatBot from "../pages/ChatBot";
import Sidebar from "../pages/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import UserProfileDropdown from "../pages/UserProfileDropdown";

const Layout = () => {
  const location = useLocation();

  const getHeaderText = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/courses":
        return "Courses";
      case "/chapters":
        return "Chapters";
      case "/lectures":
        return "Lectures";
      case "/users":
        return "Users & Students";
      case "/profile":
        return "Profile";
      default:
        return "Page";
    }
  };

  return (
    <div className="flex flex-row w-screen max-w-screen h-screen bg-gray-100 p-4 gap-4 overflow-hidden">
      <div className="">
        <Sidebar />
      </div>
      <div className="relative flex flex-col w-full h-screen">
        <div className="flex justify-between items-center text-black px-6 py-2 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black">{getHeaderText()}</h2>
          <div className="flex items-center justify-center">
            <UserProfileDropdown />
          </div>
        </div>
        <div className="flex-1 overflow-auto h-full mb-6">
          <Outlet />
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Layout;
