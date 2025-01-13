import ChatBot from "../pages/ChatBot";
import Sidebar from "../pages/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />

      <div className="w-full overflow-auto">
        <ChatBot />

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
