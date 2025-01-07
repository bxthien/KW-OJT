import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPages";
import UserPage from "../pages/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/userpages" element={<UserPage />} />
    </Routes> 
  );
}

export default App;
