import { Link } from "react-router-dom";

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-blue-100 text-blue-900 h-screen p-4 relative">
    {/* Logo Section with Image */}
    <div className="flex items-center space-x-2">
      <img
        src="https://img.icons8.com/?size=100&id=2AIrctH82xog&format=png&color=000000" // 여기에 원하는 이미지 링크를 넣으세요!
        alt="Logo"
        className="w-8 h-8"
      />
      <h1 className="text-lg font-bold">HOTDOG</h1>
    </div>
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
  </aside>
);

export default Sidebar;
