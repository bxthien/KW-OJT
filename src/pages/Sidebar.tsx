import { Link } from "react-router-dom";

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-blue-100 text-blue-900 h-screen p-4">
    <h1 className="text-lg font-bold">HOTDOG</h1>
    <nav className="mt-6 space-y-4">
      <Link
        to="/"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Dashboard
      </Link>
      <Link
        to="/courses"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Courses
      </Link>
      <Link
        to="users"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Users
      </Link>
      <a
        href="#"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Communication
      </a>
      <a
        href="#"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Setting
      </a>
    </nav>
    <div className="absolute bottom-4 left-4 text-sm text-blue-700">
      Hi, John
    </div>
  </aside>
);

export default Sidebar;
