import React, { useState } from "react";
import { Button, Drawer, Pagination, ColorPicker } from "antd";
import ChatBot from "./ChatBot";
import { Course, courses as initialCourses } from "../shared/constant/course";

const CourseCard: React.FC<{
  course: Course & { color: string };
  onClick: (course: Course) => void;
}> = ({ course, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
    onClick={() => onClick(course)}
  >
    <div
      className="w-full h-32 rounded-md mb-4"
      style={{ backgroundColor: course.color }}
    ></div>
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase">
      {course.tag}
    </div>
    <h2 className="text-lg font-bold mb-2 text-gray-800">{course.title}</h2>
    <div className="flex space-x-4 text-xs text-gray-600">
      <p>
        <span className="font-bold">Chapters:</span> {course.chapters}
      </p>
      <p>
        <span className="font-bold">Orders:</span> {course.orders}
      </p>
    </div>
  </div>
);

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(
    initialCourses.map((course) => ({
      ...course,
      color: "#1677ff", // Default color
    }))
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    chapters: "",
    orders: "",
    tag: "",
    color: "#1677ff", // Default color
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title || "",
      description: course.description || "",
      chapters: course.chapters.toString() || "",
      orders: course.orders.toString() || "",
      tag: course.tag || "",
      color: course.color || "#1677ff",
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false); // Close the drawer first
    setTimeout(() => {
      // Reset states after the drawer has closed
      setSelectedCourse(null);
      setNewCourse({
        title: "",
        description: "",
        chapters: "",
        orders: "",
        tag: "",
        color: "#1677ff",
      });
    }, 300); // Add a delay matching the drawer's animation duration
  };

  const handleSaveCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      alert("Please fill in all required fields.");
      return;
    }

    const newCourseData = {
      id: (courses.length + 1).toString(),
      title: newCourse.title,
      tag: newCourse.tag || "New",
      chapters: Number(newCourse.chapters) || 0,
      orders: Number(newCourse.orders) || 0,
      certificates: 0,
      reviews: 0,
      addedToShelf: 0,
      description: newCourse.description,
      color: newCourse.color,
    };

    setCourses([...courses, newCourseData]);
    closeDrawer();
  };

  const handleEditCourse = () => {
    if (selectedCourse) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? {
                ...course,
                title: newCourse.title || course.title,
                description: newCourse.description || course.description,
                chapters: newCourse.chapters
                  ? Number(newCourse.chapters)
                  : course.chapters,
                orders: newCourse.orders
                  ? Number(newCourse.orders)
                  : course.orders,
                tag: newCourse.tag || course.tag,
                color: newCourse.color || course.color,
              }
            : course
        )
      );
      closeDrawer();
    }
  };

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      closeDrawer();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div>
      <div className="p-8 h-screen overflow-auto bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Courses</h1>
          <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
            Add Course
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {currentCourses.map((course, index) => (
            <CourseCard
              key={index}
              course={course}
              onClick={handleCourseClick}
            />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            total={courses.length}
            pageSize={coursesPerPage}
            onChange={handlePageChange}
          />
        </div>
        <ChatBot />
      </div>

      <Drawer
        title={
          selectedCourse
            ? `Edit Course - ${selectedCourse.title}`
            : "Add Course"
        }
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        <div className="space-y-4">
          {/* Course Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Course Title
            </label>

            <input
              type="text"
              placeholder="Course Title"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
          </div>

          {/* Course Description Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Course Description
            </label>
            <textarea
              placeholder="Course Description"
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
          </div>

          {/* Number of Chapters Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Number of Chapters
            </label>
            <input
              type="number"
              placeholder="Number of Chapters"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newCourse.chapters}
              onChange={(e) =>
                setNewCourse({ ...newCourse, chapters: e.target.value })
              }
            />
          </div>

          {/* Number of Orders Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Number of Orders
            </label>
            <input
              type="number"
              placeholder="Number of Orders"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newCourse.orders}
              onChange={(e) =>
                setNewCourse({ ...newCourse, orders: e.target.value })
              }
            />
          </div>

          {/* Course Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tag
            </label>
            <input
              type="text"
              placeholder="Tag (e.g., Beginner for KNU)"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newCourse.tag}
              onChange={(e) =>
                setNewCourse({ ...newCourse, tag: e.target.value })
              }
            />
          </div>

          {/* Color Picker Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Color
            </label>
            <ColorPicker
              value={newCourse.color}
              onChange={(color) =>
                setNewCourse({ ...newCourse, color: color.toHexString() })
              }
            />
          </div>

          {/* Buttons for Save and Delete */}
          <div className="flex justify-between space-x-4">
            {selectedCourse && (
              <Button
                type="default"
                danger
                onClick={handleDeleteCourse}
                className="w-full"
              >
                Delete
              </Button>
            )}
            <Button
              type="primary"
              onClick={selectedCourse ? handleEditCourse : handleSaveCourse}
              className="w-full"
            >
              {selectedCourse ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CoursesPage;
