const Sidebar: React.FC = () => (
  <aside className="w-64 bg-blue-100 text-blue-900 h-screen p-4">
    <h1 className="text-lg font-bold">Byway</h1>
    <nav className="mt-6 space-y-4">
      <a
        href="/"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Dashboard
      </a>
      <a
        href="/courses"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Courses
      </a>
      <a
        href="#"
        className="block py-2 px-4 bg-blue-100 text-blue-900 rounded hover:bg-blue-300 transition-colors"
      >
        Users
      </a>
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
