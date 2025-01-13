import React from "react";
import { Course } from "../../../shared/constant/course";

const CourseCard: React.FC<{
  course: Course & { color: string };
  onClick: (course: Course) => void;
}> = ({ course, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
    onClick={() => onClick(course)}
    style={{ width: "280px", height: "350px", minWidth: "280px" }}
  >
    <div
      className="w-full h-32 rounded-md mb-4"
      style={{ backgroundColor: course.color }}
    ></div>
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase truncate">
      {course.tag}
    </div>
    <h2 className="text-lg font-bold mb-2 text-gray-800 break-words">
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

export default CourseCard;
