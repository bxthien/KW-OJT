/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  // Pagination,
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
  course_chapter?: { chapter_id: string }[];
}

interface Chapter {
  id: string;
  chapter_name: string;
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
  const [selectedChapters, setSelectedChapters] = useState<
    { chapter_id?: string }[]
  >([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState<string>("#1677ff");
  const [isAddingNewCourse, setIsAddingNewCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 9;

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
        course_id, 
        course_name, 
        course_description, 
        color,
        course_chapter (
          chapter_id
        )
          `
        )
        .order("date_of_update", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error.message);
        return;
      }

      const formattedCourses = data.map((course) => ({
        id: course.course_id,
        title: course.course_name,
        description: course.course_description || "No description available",
        color: course.color || "#1677ff",
        course_chapter: course.course_chapter,
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase.from("chapter").select("*");
      // .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching chapters:", error.message);
        return;
      }

      const formattedChapters = data.map((item) => ({
        id: item.chapter_id,
        chapter_name: item.chapter_name,
      }));
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
        setSelectedChapters(course.course_chapter || []);
        setSelectedCourse(course);
        setNewTitle(course.title);
        setNewDescription(course.description);
        setNewColor(course.color);
        setIsAddingNewCourse(false);
        fetchChapters();
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

      if (!selectedCourse) {
        console.error("No course selected.");
        return;
      }

      const { error: chapterError } = await supabase
        .from("course_chapter")
        .upsert(
          selectedChapters.map((chapter) => ({
            course_id: selectedCourse.id,
            chapter_id: chapter.chapter_id,
          })),
          { onConflict: "course_id,chapter_id" }
        );

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

        // Fetch existing chapters for the selected course
        const { data: existingChapters, error: fetchError } = await supabase
          .from("course_chapter")
          .select("chapter_id")
          .eq("course_id", selectedCourse.id);

        if (fetchError) {
          console.error(
            "Error fetching existing chapters:",
            fetchError.message
          );
          alert("Failed to fetch existing chapters.");
          return;
        }

        // Find chapters to delete
        const chaptersToDelete = existingChapters
          .filter(
            (existingChapter) =>
              !selectedChapters.some(
                (selectedChapter) =>
                  selectedChapter.chapter_id === existingChapter.chapter_id
              )
          )
          .map((chapter) => chapter.chapter_id);

        // Delete chapters that are not in selectedChapters
        if (chaptersToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from("course_chapter")
            .delete()
            .in("chapter_id", chaptersToDelete)
            .eq("course_id", selectedCourse.id);

          if (deleteError) {
            console.error("Error deleting chapters:", deleteError.message);
            alert("Failed to delete chapters.");
            return;
          }
        }

        // Upsert selected chapters
        const { error: chapterError } = await supabase
          .from("course_chapter")
          .upsert(
            selectedChapters.map((chapter) => ({
              course_id: selectedCourse.id,
              chapter_id: chapter.chapter_id,
            })),
            { onConflict: "course_id,chapter_id" }
          );

        if (error || chapterError) {
          console.error(
            "Error saving course updates:",
            error?.message || chapterError?.message
          );
          alert("Failed to update course.");
          return;
        }

        fetchCourses();

        setIsDrawerOpen(false);
      } catch (err) {
        console.error("Error saving course updates:", err);
        alert("An error occurred while updating the course.");
      }
    }
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

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
        width={500}
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

          <div className="flex flex-row items-center my-4">
            <h3 className="font-semibold text-gray-600">Course Color:</h3>
            <ColorPicker
              className="ml-4"
              value={newColor}
              onChange={(color) => setNewColor(color.toHexString())}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-600">Add Chapters:</h3>
            <Select
              mode="multiple"
              placeholder="Select chapters to add"
              style={{ width: "100%", marginBottom: "16px" }}
              value={selectedChapters.map((ch) => ch.chapter_id)}
              onChange={(selectedChapterIds) => {
                const newSelectedChapters = selectedChapterIds
                  .filter(
                    (chapterId): chapterId is string => chapterId !== undefined
                  )
                  .map((chapterId) => {
                    const chapter = chapters.find((ch) => ch.id === chapterId);
                    return chapter ? { chapter_id: chapter.id } : null;
                  })
                  .filter((chapter) => chapter !== null);

                setSelectedChapters(
                  newSelectedChapters as { chapter_id: string }[]
                );
              }}
              options={chapters.map((chapter) => ({
                label: chapter.chapter_name,
                value: chapter.id,
              }))}
            />

            <h3 className="font-semibold text-gray-600">Chapters:</h3>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <List
                dataSource={selectedChapters}
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
                      {
                        chapters.find((ch) => ch.id === item.chapter_id)
                          ?.chapter_name
                      }
                    </div>
                    <MinusCircleOutlined
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedChapters((prevChapters) =>
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
