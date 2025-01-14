import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Pagination,
  ColorPicker,
  Input,
  Checkbox,
  List,
  Select,
} from "antd";
import ChatBot from "./ChatBot";
import { supabase } from "../supabase/supabaseClient";
import { MinusCircleOutlined } from "@ant-design/icons";

interface Course {
  id: string;
  title: string;
  color: string;
  description: string;
}

const CourseCard: React.FC<{
  course: Course;
  onClick: (courseId: string) => void;
  isSelected: boolean;
  isDeleteMode: boolean;
}> = ({ course, onClick, isSelected, isDeleteMode }) => (
  <div
    className={`bg-white pb-4 rounded-lg shadow-lg border ${
      isSelected ? "border-blue-500" : "border-gray-200"
    } relative cursor-pointer transform transition-transform duration-200 hover:scale-105`}
    style={{
      maxWidth: "20rem", // 카드가 와이드하지 않도록 최대 너비 설정
      width: "100%", // 부모 요소에 맞게 너비를 설정
      boxSizing: "border-box", // 패딩과 보더를 포함한 너비 계산
    }}
    onClick={() => onClick(course.id)}
  >
    {isDeleteMode && (
      <Checkbox
        style={{ position: "absolute", top: 8, right: 8 }}
        checked={isSelected}
        onChange={() => onClick(course.id)}
      />
    )}
    <div
      className="w-full h-32 rounded-md mb-4"
      style={{ backgroundColor: course.color }}
    ></div>
    <h2 className="text-lg font-bold mb-2 text-gray-800 px-4">
      {course.title}
    </h2>
  </div>
);

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState<string>("#1677ff");
  const [isAddingNewCourse, setIsAddingNewCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<
    { id: string; chapter_name: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 9;

  useEffect(() => {
    setChapters([
      { id: "1", chapter_name: "Introduction" },
      { id: "2", chapter_name: "Intermediate Concepts" },
      { id: "3", chapter_name: "Advanced Techniques" },
      { id: "4", chapter_name: "I want to go home" },
      { id: "5", chapter_name: "It's real" },
    ]);
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("course_id, course_name, course_description, color");

        if (error) {
          console.error("Error fetching courses:", error.message);
          return;
        }

        const formattedCourses = data.map((course) => ({
          id: course.course_id,
          title: course.course_name,
          description: course.course_description || "No description available",
          color: course.color || "#1677ff",
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const fetchChapters = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_chapter")
        .select(
          `
          chapter:chapter_id (
            id,
            chapter_name
          )
        `
        )
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching chapters:", error.message);
        return;
      }

      const formattedChapters = data.map((item: any) => item.chapter);
      setChapters(formattedChapters);
    } catch (err) {
      console.error("Error fetching chapters:", err);
    }
  };

  const handleCourseClick = (courseId: string) => {
    if (isDeleteMode) {
      setSelectedCourses((prevSelected) =>
        prevSelected.includes(courseId)
          ? prevSelected.filter((id) => id !== courseId)
          : [...prevSelected, courseId]
      );
    } else {
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        setSelectedCourse(course);
        setNewTitle(course.title);
        setNewDescription(course.description);
        setNewColor(course.color);
        setIsAddingNewCourse(false);
        fetchChapters(courseId);
        setIsDrawerOpen(true);
      }
    }
  };

  const handleDeleteSelectedCourses = async () => {
    if (selectedCourses.length === 0) {
      alert("No courses selected for deletion.");
      return;
    }

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .in("course_id", selectedCourses);

      if (error) {
        console.error("Error deleting courses:", error.message);
        alert("Failed to delete courses. Please try again.");
        return;
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => !selectedCourses.includes(course.id))
      );
      setSelectedCourses([]);
      setIsDeleteMode(false);
      alert("Selected courses have been deleted.");
    } catch (err) {
      console.error("Error deleting selected courses:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAddNewCourse = () => {
    setSelectedCourse(null);
    setNewTitle("");
    setNewDescription("");
    setNewColor("#1677ff");
    setIsAddingNewCourse(true);
    setIsDrawerOpen(true);
  };

  const handleSaveNewCourse = async () => {
    if (!newTitle || !newDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            course_name: newTitle,
            course_description: newDescription,
            color: newColor,
          },
        ])
        .select("*")
        .single();

      if (error || !data) {
        console.error("Error adding new course:", error?.message);
        alert("Failed to add course.");
        return;
      }

      const newCourse = {
        id: data.course_id,
        title: newTitle,
        color: newColor,
        description: newDescription,
      };

      setCourses([...courses, newCourse]);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Error saving new course:", err);
      alert("An error occurred while adding the course.");
    }
  };

  const handleSaveExistingCourse = async () => {
    if (selectedCourse) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({
            course_name: newTitle,
            course_description: newDescription,
            color: newColor,
          })
          .eq("course_id", selectedCourse.id);

        if (error) {
          console.error("Error saving course updates:", error.message);
          alert("Failed to update course.");
          return;
        }

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id
              ? {
                  ...course,
                  title: newTitle,
                  description: newDescription,
                  color: newColor,
                }
              : course
          )
        );
        setIsDrawerOpen(false);
      } catch (err) {
        console.error("Error saving course updates:", err);
        alert("An error occurred while updating the course.");
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
          {isDeleteMode ? (
            <div className="flex gap-2">
              <Button type="default" onClick={() => setIsDeleteMode(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleDeleteSelectedCourses}
              >
                Confirm Delete
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button type="primary" onClick={handleAddNewCourse}>
                Add Course
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteMode(true)}
              >
                Delete Courses
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={handleCourseClick}
              isSelected={selectedCourses.includes(course.id)}
              isDeleteMode={isDeleteMode}
            />
          ))}
        </div>

        {/* <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            total={courses.length}
            pageSize={8}
            onChange={handlePageChange}
          />
        </div> */}
        <ChatBot />
      </div>

      <Drawer
        title={
          isAddingNewCourse
            ? "Add New Course"
            : `Edit Course - ${selectedCourse?.title}`
        }
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <div>
          <h3 className="mb-4 font-semibold text-gray-600">Course Name:</h3>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <h3 className="mt-4 mb-4 font-semibold text-gray-600">
            Course Description:
          </h3>
          <Input.TextArea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={4}
          />

          <h3 className="mt-4 mb-4 font-semibold text-gray-600">
            Course Color:
          </h3>
          <ColorPicker
            value={newColor}
            onChange={(color) => setNewColor(color.toHexString())}
          />

          <div>
            <h3 className="font-semibold text-gray-600">Add Chapters:</h3>
            <Select
              mode="multiple"
              placeholder="Select chapters to add"
              style={{ width: "100%", marginBottom: "16px" }}
              onChange={(selectedChapters) => {
                // 새로운 챕터 생성 및 중복 방지
                const newChapters = selectedChapters
                  .map((chapterName: string) => ({
                    id: String(Date.now() + Math.random()), // 고유 ID 생성
                    chapter_name: chapterName,
                  }))
                  .filter(
                    (newChapter: { chapter_name: string }) =>
                      !chapters.some(
                        (existingChapter) =>
                          existingChapter.chapter_name ===
                          newChapter.chapter_name
                      )
                  );

                // 리스트에 새로운 챕터 추가
                setChapters((prevChapters) => [
                  ...prevChapters,
                  ...newChapters,
                ]);
              }}
              options={[
                { label: "Introduction", value: "Introduction" },
                {
                  label: "Intermediate Concepts",
                  value: "Intermediate Concepts",
                },
                { label: "Advanced Techniques", value: "Advanced Techniques" },
                { label: "I want to go home", value: "I want to go home" },
                { label: "It's real", value: "It's real" },
              ]}
            />

            <h3 className="font-semibold text-gray-600">Chapters:</h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <List
                dataSource={chapters}
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                        {index + 1}.
                      </span>
                      {item.chapter_name}
                    </div>
                    <MinusCircleOutlined
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        // 리스트에서 해당 챕터 제거
                        setChapters((prevChapters) =>
                          prevChapters.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            <Button
              type="primary"
              onClick={
                isAddingNewCourse
                  ? handleSaveNewCourse
                  : handleSaveExistingCourse
              }
            >
              Save
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CoursesPage;
