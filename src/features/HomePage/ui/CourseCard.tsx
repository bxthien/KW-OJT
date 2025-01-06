// src/components/CourseCard.tsx
import React from "react";
import { Course } from "../../../shared/constant/course";

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 min-w-[250px] max-w-[300px] cursor-pointer"
    onClick={() => onClick(course)}
  >
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase">
      {course.tag}
    </div>
    <h2 className="text-lg font-bold mb-2 text-gray-800 hover:underline">
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

export default CourseCard;
