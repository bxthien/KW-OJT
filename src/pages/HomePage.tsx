import React, { useState } from "react";
import ChatBot from "./ChatBot";
import CourseCard from "../features/HomePage/ui/CourseCard";
import { Course, courses } from "../shared/constant/course";
import UserProfileDropdown from "../features/HomePage/ui/UserProfileDropdown";
import CalendarComponent from "../features/HomePage/ui/CalendarComponent";
import CarouselComponent from "../features/HomePage/ui/CarouselComponent";

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

        {/* Carousel + 캘린더 섹션 */}
        <section className="grid grid-cols-4 gap-6 mb-6">
          {/* Carousel 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-3 flex flex-col h-full">
            <h3 className="text-3xl font-bold mb-2 text-black flex items-center">
              Welcome! <span className="ml-2">👋</span>
            </h3>
            <CarouselComponent
              items={[
                {
                  key: 1,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1724224259580-04c544bd1fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZG9nfGVufDB8fDB8fHww",
                  text: "Welcome to HOTDOG LMS!",
                  textColor: "text-yellow-300",
                },
                {
                  key: 2,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1720534517470-8815da9e3998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZHl8ZW58MHx8MHx8fDA%3D",
                  text: "Add your courses",
                  textColor: "text-red-400",
                },
                {
                  key: 3,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1733900623866-fc9102b17450?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGpvaW58ZW58MHx8MHx8fDA%3D",
                  text: "Join our LMS",
                  textColor: "text-black-500",
                },
                {
                  key: 4,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1731582099083-969d4dfe2580?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVCJUFBJUE5JUVEJTkxJTlDfGVufDB8fDB8fHww",
                  text: "Achieve your goals!",
                  textColor: "text-white",
                },
              ]}
            />
          </div>

          {/* 캘린더 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-full">
            <h3 className="text-3xl font-bold mb-2 text-black flex items-center">
              Calendar <span className="ml-2">📅</span>
            </h3>
            <CalendarComponent />
          </div>
        </section>

        {/* Courses Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-black">Courses</h3>
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
