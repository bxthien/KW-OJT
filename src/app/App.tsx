import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
    </Routes>
  );
}

export default App;
