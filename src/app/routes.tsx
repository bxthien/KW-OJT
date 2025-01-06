import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPages";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Layout from "./layout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/courses",
        element: <CoursesPage />,
      },
    ],
  },
]);

export default router;
