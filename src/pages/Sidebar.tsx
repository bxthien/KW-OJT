import { Link } from "react-router-dom";

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-blue-100 text-black h-screen p-4 font-sans">
    {/* HOTDOG Logo */}
    <div className="flex items-center space-x-2">
      <img
        src="https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000"
        alt="Hotdog Logo"
        className="w-8 h-8"
      />
      <h1 className="text-lg font-bold text-black">HOTDOG</h1>
    </div>

    {/* Navigation Menu */}
    <nav className="mt-6 space-y-4">
      <Link
        to="/"
        className="flex items-center py-2 px-4 bg-blue-100 text-black rounded hover:bg-blue-300 transition-colors text-base font-medium"
      >
        <img
          src="https://img.icons8.com/?size=100&id=16134&format=png&color=000000"
          alt="Dashboard Icon"
          className="w-6 h-6 mr-2"
        />
        Dashboard
      </Link>
      <Link
        to="/courses"
        className="flex items-center py-2 px-4 bg-blue-100 text-black rounded hover:bg-blue-300 transition-colors text-base font-medium"
      >
        <img
          src="https://img.icons8.com/?size=100&id=85927&format=png&color=000000"
          alt="Courses Icon"
          className="w-6 h-6 mr-2"
        />
        Courses
      </Link>
      <Link
        to="users"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        <img
          src="https://img.icons8.com/?size=100&id=82751&format=png&color=000000"
          alt="Users Icon"
          className="w-6 h-6 mr-2"
        />
        Users
      </Link>
      <Link
        to="#"
        className="flex items-center py-2 px-4 bg-blue-100 text-black rounded hover:bg-blue-300 transition-colors text-base font-medium"
      >
        <img
          src="https://img.icons8.com/?size=100&id=a8cZMQaCOiz0&format=png&color=000000"
          alt="Communication Icon"
          className="w-6 h-6 mr-2"
        />
        Communication
      </Link>
      <Link
        to="#"
        className="flex items-center py-2 px-4 bg-blue-100 text-black rounded hover:bg-blue-300 transition-colors text-base font-medium"
      >
        <img
          src="https://img.icons8.com/?size=100&id=82535&format=png&color=000000"
          alt="Setting Icon"
          className="w-6 h-6 mr-2"
        />
        Setting
      </Link>
    </nav>
  </aside>
);

export default Sidebar;
