import React, { useState } from "react";
import { Button, Drawer, Pagination } from "antd";
import ChatBot from "./ChatBot";
import { Course, courses as initialCourses } from "../shared/constant/course";

const generateRandomColor = (() => {
  const pastelColors = [
    "#F5DF4D", // Pantone Yellow
    "#00539C", // Pantone Classic Blue
    "#D81159", // Pantone Fiesta Red
    "#F94877", // Pantone Coral Pink
    "#6A0572", // Pantone Purple
    "#88B04B", // Pantone Greenery
    "#FF6F61", // Pantone Living Coral
    "#009473", // Pantone Jade Green
    "#F7CAC9", // Pantone Rose Quartz
    "#92A8D1", // Pantone Serenity
  ];
  const usedColors = new Set();

  return () => {
    const availableColors = pastelColors.filter(
      (color) => !usedColors.has(color)
    );
    if (availableColors.length === 0) {
      usedColors.clear();
    }
    const color =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    usedColors.add(color);
    return color;
  };
})();

const CourseCard: React.FC<{
  course: Course & { color: string };
  onClick: (course: Course) => void;
}> = ({ course, onClick }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
    <div
      className="w-full h-32 rounded-md mb-4"
      style={{ backgroundColor: course.color }}
    ></div>
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase">
      {course.tag}
    </div>
    <h2
      className="text-lg font-bold mb-2 text-gray-800 hover:underline cursor-pointer"
      onClick={() => onClick(course)}
    >
      {course.title}
    </h2>
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
      color: generateRandomColor(),
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
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title || "",
      description: course.description || "",
      chapters: course.chapters.toString() || "",
      orders: course.orders.toString() || "",
      tag: course.tag || "",
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedCourse(null);
    setNewCourse({
      title: "",
      description: "",
      chapters: "",
      orders: "",
      tag: "",
    });
    setIsDrawerOpen(false);
  };

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveCourse = () => {
    if (newCourse.title && newCourse.description) {
      const newCourseData = {
        id: (courses.length + 1).toString(),
        title: newCourse.title,
        tag: newCourse.tag || "New", // Use input tag or default to "New"
        chapters: Number(newCourse.chapters) || 0, // Convert chapters to number
        orders: Number(newCourse.orders) || 0, // Convert orders to number
        certificates: 0, // Default certificates
        reviews: 0, // Default reviews
        addedToShelf: 0,
        description: newCourse.description,
        color: generateRandomColor(),
      };
      setCourses([...courses, newCourseData]);
      closeDrawer();
    } else {
      alert("Please fill in all fields.");
    }
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
                color: course.color, // Preserve the color
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
          <Button type="primary" onClick={showDrawer}>
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
        {/* ChatBot Icon */}
        <ChatBot />
      </div>

      {/* Drawer for Course Details */}
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
            onChange={(e) =>
              setNewCourse({ ...newCourse, chapters: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Number of Orders"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.orders}
            onChange={(e) =>
              setNewCourse({ ...newCourse, orders: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Tag (e.g., Beginner for KNU)"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.tag}
            onChange={(e) =>
              setNewCourse({ ...newCourse, tag: e.target.value })
            }
          />
          <Button
            type="primary"
            className="w-full"
            onClick={selectedCourse ? handleEditCourse : handleSaveCourse}
          >
            {selectedCourse ? "Edit Course" : "Save Course"}
          </Button>
          {/* Add this Delete button */}
          {selectedCourse && (
            <Button
              type="default"
              danger
              className="w-full mt-2"
              onClick={handleDeleteCourse}
            >
              Delete Course
            </Button>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CoursesPage;
