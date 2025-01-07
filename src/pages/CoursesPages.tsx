import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { CloseSquareOutlined } from "@ant-design/icons";
import ChatBot from "./ChatBot";
import { Course, courses as initialCourses } from "../shared/constant/course";

const CourseCard: React.FC<{
  course: Course;
  onClick: (course: Course) => void;
  onDelete: (id: string) => void;
}> = ({ course, onClick, onDelete }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
    <div
      className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-500"
      onClick={() => onDelete(course.id)}
    >
      <CloseSquareOutlined className="text-lg" />
    </div>
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase">
      {course.tag}
    </div>
    <h2
      className="text-lg font-bold mb-2 text-gray-800 hover:underline cursor-pointer"
      onClick={() => onClick(course)}
    >
      {course.title}
    </h2>
    <p className="text-sm text-gray-500 mb-4">ID: {course.id}</p>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
      <div>
        <p>Chapters:</p>
        <p>{course.chapters}</p>
      </div>
      <div>
        <p>Orders:</p>
        <p>{course.orders}</p>
      </div>
    </div>
  </div>
);

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    chapters: "",
    orders: "",
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setNewCourse({ title: "", description: "", chapters: "", orders: "" }); // Reset new course fields
  };

  const handleSaveCourse = () => {
    if (newCourse.title && newCourse.description) {
      const newCourseData: Course = {
        id: (courses.length + 1).toString(),
        title: newCourse.title,
        tag: "New", // Default tag
        chapters: Number(newCourse.chapters) || 0, // Convert chapters to number
        orders: Number(newCourse.orders) || 0, // Convert orders to number
        certificates: 0, // Default certificates
        reviews: 0, // Default reviews
        addedToShelf: 0, // Default shelf value
      };
      setCourses([...courses, newCourseData]);
      closeDrawer();
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div>
      <div className="p-8 h-screen overflow-auto bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Courses</h1>
          <Button type="primary" onClick={showDrawer}>
            Add Course
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course: Course, index: number) => (
            <CourseCard
              key={index}
              course={course}
              onClick={handleCourseClick}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
        {/* ChatBot Icon */}
        <ChatBot />
      </div>

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
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Drawer
        title="Add Course"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Course Title"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
          />
          <textarea
            placeholder="Course Description"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Number of Chapters"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.chapters}
            onFocus={(e) =>
              e.target.value === "0" &&
              setNewCourse({ ...newCourse, chapters: "" })
            }
            onChange={(e) =>
              setNewCourse({ ...newCourse, chapters: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Number of Orders"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.orders}
            onFocus={(e) =>
              e.target.value === "0" &&
              setNewCourse({ ...newCourse, orders: "" })
            }
            onChange={(e) =>
              setNewCourse({ ...newCourse, orders: e.target.value })
            }
          />
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSaveCourse}
          >
            Save Course
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default CoursesPage;
