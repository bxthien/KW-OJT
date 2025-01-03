import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
