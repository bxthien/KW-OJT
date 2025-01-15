import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPages";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Layout from "./layout";
import UserPage from "../pages/UserPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ProfilePage from "../pages/ProfilePage";
import ChapterPage from "../pages/ChapterPage";
import LecturePage from "../pages/LecturePage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/change-password",
    element: <ChangePasswordPage />,
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
      {
        path: "/chapters",
        element: <ChapterPage />,
      },
      {
        path: "/lectures",
        element: <LecturePage />,
      },
      {
        path: "/users",
        element: <UserPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;
