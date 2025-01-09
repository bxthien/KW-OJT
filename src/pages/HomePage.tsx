import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { getCurrentUser, logoutUser } from "../supabase/authService";
import { supabase } from "../supabase/supabaseClient";
import { getUserName, getCourseNames, getCourseDescriptions } from "../supabase/dataService";
import ChatBot from "./ChatBot";
import ProfileCard from "../features/HomePage/ui/ProfileCard";
import CourseCard from "../features/HomePage/ui/CourseCard";
import { Course } from "../shared/constant/course";
import ideaImage from "../assets/idea.png";

const HomePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notificationDisplayed, setNotificationDisplayed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // 로그인 성공 알림 표시
    if (location.state?.notification && !notificationDisplayed) {
      api.success({
        message: location.state.notification,
        description: "Welcome to HOTDOG LMS!",
        placement: "topRight",
      });
      setNotificationDisplayed(true);
    }

    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const fetchedUserName = await getUserName(currentUser.id);
          setUserName(fetchedUserName || "Username");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login");
      }
    };

    const fetchCourses = async () => {
      try {
        const courseNames = await getCourseNames();
        const courseDescriptions = await getCourseDescriptions();
        const formattedCourses = courseNames.map((courseName, index) => ({
          id: (index + 1).toString(),
          title: courseName,
          description: courseDescriptions[index] || "No description available",
          tag: "General",
          chapters: Math.floor(Math.random() * 10) + 1,
          orders: Math.floor(Math.random() * 50) + 1,
          color: "#1677ff", // 기본 색상
          certificates: 0,
          reviews: 0,
          addedToShelf: 0,
        }));
        setCourses(formattedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchUserData();
    fetchCourses();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        getUserName(session.user.id).then((fetchedUserName) => {
          setUserName(fetchedUserName || "Username");
        });
      } else {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location.state, api, navigate, notificationDisplayed]);

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);

    try {
      const descriptions = await getCourseDescriptions();
      const description = descriptions[parseInt(course.id) - 1]; // Assuming course IDs are sequential
      setSelectedDescription(description || "No description available");
    } catch (err) {
      console.error("Error fetching course description:", err);
      setSelectedDescription("Error fetching description");
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setSelectedDescription(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {contextHolder}
      <main className="relative flex flex-col bg-gray-100 p-6 h-screen overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 text-black">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Profile Section */}
        <div className="flex items-center mb-6 bg-white p-6 rounded-lg shadow-md">
          <ProfileCard username={userName} />
          <div className="ml-12 flex items-center flex-1 justify-between gap-12">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-black mb-4">
                Hello, {userName || "Username"}!
              </h1>
              <p className="text-2xl text-gray-600">Welcome to HOTDOG LMS!!</p>
            </div>
            <img
              src={ideaImage}
              alt="Idea"
              className="w-80 h-auto object-cover"
            />
          </div>
        </div>

        {/* Courses Section */}
        {user && (
          <section className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-black">Courses</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <ChatBot />

      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
            <p className="text-gray-600">
              Description: {selectedDescription}
            </p>
            <textarea
              className="w-full mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a description..."
              rows={4}
            />
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
