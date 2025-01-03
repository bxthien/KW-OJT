// Install TailwindCSS by following the official docs: https://tailwindcss.com/docs/installation

import React from "react";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import { Course } from "../shared/constant/course";

const courses: Course[] = [
  {
    tag: "FOR KNU",
    title: "GLOBAL INTERNSHIP - KNU",
    id: "#21453",
    chapters: 13,
    orders: 16,
    certificates: 10,
    reviews: 0,
    addedToShelf: 16,
  },
  {
    tag: "BEGINNER",
    title: "Beginner's Guide to Design",
    id: "#15735",
    chapters: 13,
    orders: 254,
    certificates: 25,
    reviews: 25,
    addedToShelf: 500,
  },
  {
    tag: "INTERMEDIATE",
    title: "Intermediate's Guide to Design",
    id: "#75179",
    chapters: 20,
    orders: 126,
    certificates: 21,
    reviews: 34,
    addedToShelf: 207,
  },
  {
    tag: "BEGINNER",
    title: "Beginner's Web Guide",
    id: "#69821",
    chapters: 13,
    orders: 254,
    certificates: 25,
    reviews: 25,
    addedToShelf: 500,
  },
  {
    tag: "INTERMEDIATE",
    title: "Intermediate's Web Guide",
    id: "#28927",
    chapters: 13,
    orders: 254,
    certificates: 25,
    reviews: 25,
    addedToShelf: 500,
  },
];

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <div className="mb-2 text-sm font-bold text-gray-500 uppercase">
      {course.tag}
    </div>
    <h2 className="text-lg font-bold mb-2 text-gray-800">{course.title}</h2>
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
      <div>
        <p>Certificates:</p>
        <p>{course.certificates}</p>
      </div>
      <div>
        <p>Reviews:</p>
        <p>{course.reviews}</p>
      </div>
      <div>
        <p>Added to Shelf:</p>
        <p>{course.addedToShelf}</p>
      </div>
    </div>
  </div>
);

const CoursesPage: React.FC = () => (
  <div className="flex">
    <Sidebar />
    <div className="w-4/5 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      {/* ChatBot Icon */}
      <ChatBot />
    </div>
  </div>
);

export default CoursesPage;
