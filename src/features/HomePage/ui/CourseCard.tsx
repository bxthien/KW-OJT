import React from "react";
import { Course } from "../../../shared/constant/course";

const CourseCard: React.FC<{
  course: Course & { color: string };
  onClick: (course: Course) => void;
}> = ({ course, onClick }) => (
  <div
    className="bg-white pb-4 rounded-lg shadow-lg border"
    onClick={() => onClick(course)}
    style={{
      width: "100%",
      height: "220px",
      minWidth: "13rem",
      cursor: "pointer", // 손모양 커서
    }}
  >
    <div
      className="w-full h-32 rounded-md mb-4"
      style={{ backgroundColor: course.color }}
    ></div>
    <h2 className="text-lg font-bold mb-2 text-gray-800 px-4">
      {course.title}
    </h2>
  </div>
);

export default CourseCard;
