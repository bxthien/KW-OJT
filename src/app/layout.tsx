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
    <div className="flex flex-row max-w-screen">
      <div className="flex">
        <Sidebar />
      </div>
      <div className="relative flex flex-col w-full h-screen">
        <div className="flex justify-between items-center text-black px-6 py-2 bg-slate-200">
          <h2 className="text-2xl font-bold text-black">{getHeaderText()}</h2>
          <div className="flex items-center justify-center">
            <UserProfileDropdown />
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Layout;
