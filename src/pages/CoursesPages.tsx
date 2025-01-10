import React, { useEffect, useState } from "react";
import { Button, Drawer, Pagination, ColorPicker, Input } from "antd";
import ChatBot from "./ChatBot";
import { Course } from "../shared/constant/course";
import { getCoursesWithColors } from "../supabase/dataService";
import { supabase } from "../supabase/supabaseClient";

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
    <h2 className="text-lg font-bold mb-2 text-gray-800">{course.title}</h2>
  </div>
);

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState<string>("#1677ff"); // Default color
  const coursesPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseData = await getCoursesWithColors();
      const formattedCourses = courseData.map((course, index) => ({
        id: (index + 1).toString(),
        title: course.course_name,
        color: course.color,
        chapters: Math.floor(Math.random() * 10) + 1,
        orders: Math.floor(Math.random() * 50) + 1,
        description: `${course.course_name} Description`,
        tag: "General",
        certificates: 0,
        reviews: 0,
        addedToShelf: 0,
      }));
      setCourses(formattedCourses);
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setNewTitle(course.title);
    setNewDescription(course.description);
    setNewColor(course.color || "#1677ff");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedCourse(null);
    setIsDrawerOpen(false);
  };

  const handleTitleSave = async () => {
    if (selectedCourse) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ course_name: newTitle })
          .eq("course_name", selectedCourse.title);

        if (error) {
          console.error("Error saving title:", error.message);
        } else {
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.title === selectedCourse.title
                ? { ...course, title: newTitle }
                : course
            )
          );
        }
      } catch (err) {
        console.error("Error saving title:", err);
      }
    }
  };

  const handleDescriptionSave = async () => {
    if (selectedCourse) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ course_description: newDescription })
          .eq("course_name", selectedCourse.title);

        if (error) {
          console.error("Error saving description:", error.message);
        } else {
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.title === selectedCourse.title
                ? { ...course, description: newDescription }
                : course
            )
          );
        }
      } catch (err) {
        console.error("Error saving description:", err);
      }
    }
  };

  const handleColorSave = async () => {
    if (selectedCourse) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ color: newColor })
          .eq("course_name", selectedCourse.title);

        if (error) {
          console.error("Error saving color:", error.message);
        } else {
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.title === selectedCourse.title
                ? { ...course, color: newColor }
                : course
            )
          );
        }
      } catch (err) {
        console.error("Error saving color:", err);
      }
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
        {/* <ChatBot /> */}
      </div>

      <Drawer
        title={
          selectedCourse
            ? `Edit Course - ${selectedCourse.title}`
            : "Edit Course"
        }
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        <div>
          <h3 className="mb-4 font-semibold text-gray-600">
            Edit Course Name:
          </h3>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleSave}
          />

          <h3 className="mt-4 mb-4 font-semibold text-gray-600">
            Edit Course Description:
          </h3>
          <Input.TextArea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            rows={4}
          />

          <h3 className="mt-4 mb-4 font-semibold text-gray-600">
            Change Course Color:
          </h3>
          <ColorPicker
            value={newColor}
            onChange={(color) => setNewColor(color.toHexString())}
          />
          <div className="mt-4 flex justify-end gap-4">
            <Button onClick={closeDrawer}>Close</Button>
            <Button type="primary" onClick={handleColorSave}>
              Save
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CoursesPage;
