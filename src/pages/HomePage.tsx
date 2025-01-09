import React, { useState } from "react";
import ChatBot from "./ChatBot";
import ProfileCard from "../features/HomePage/ui/ProfileCard";
import CourseCard from "../features/HomePage/ui/CourseCard";
import { Course, courses } from "../shared/constant/course";
import UserProfileDropdown from "../pages/UserProfileDropdown"; // 컴포넌트 경로에 맞게 수정

const HomePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="relative flex flex-col bg-gray-100 p-6 h-screen overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 text-black">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          {/* 프로필 드롭다운 */}
          <UserProfileDropdown />
        </header>

        {/* Profile Section */}
        <div className="flex items-center mb-6 bg-white p-6 rounded-lg shadow-md">
          <ProfileCard />
          <div className="ml-12 flex flex-col">
            <h1 className="text-4xl font-bold text-black mb-4">
              Hello, Username 👋
            </h1>
            <p className="text-2xl text-gray-600">Welcome to HOTDOG LMS!!</p>
          </div>
        </div>

        {/* Courses Section */}
        <section className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-black">Courses</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2">
            {courses.map((course: Course, index: number) => (
              <CourseCard
                key={index}
                course={course}
                onClick={handleCourseClick}
              />
            ))}
          </div>
        </section>
      </main>

      {/* ChatBot Icon */}
      <ChatBot />

      {/* Modal */}
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
            <p className="text-gray-600">Quiz Count: {selectedCourse.orders}</p>
            <textarea
              className="w-full mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a description..."
              rows={4}
            />
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
