// courses.ts
export interface Chapter {
  name: string;
  quizCount: number;
  correctAnswers: number;
}

export interface Course {
  title: string;
  id: string;
  chapters: number;
  orders: number;
  certificates: number;
  reviews: number;
  addedToShelf: number;
  description: string;
  color: string;
  chapterDetails: Chapter[]; // 챕터 상세 정보
}

export const courses: Course[] = [
  {
    title: "KNU",
    id: "#21453",
    chapters: 3,
    orders: 16,
    certificates: 10,
    reviews: 0,
    addedToShelf: 16,
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
    chapterDetails: [
      { name: "Introduction to KNU", quizCount: 3, correctAnswers: 2 },
      { name: "Applying for Internships", quizCount: 5, correctAnswers: 4 },
      { name: "Cultural Tips", quizCount: 2, correctAnswers: 2 },
    ],
  },
  {
    title: "WEB DEVELOPMENT BOOTCAMP",
    id: "#34567",
    chapters: 4,
    orders: 30,
    certificates: 25,
    reviews: 10,
    addedToShelf: 22,
    description: "Learn modern web development techniques.",
    color: "green",
    chapterDetails: [
      { name: "HTML Basics", quizCount: 2, correctAnswers: 2 },
      { name: "CSS Fundamentals", quizCount: 3, correctAnswers: 2 },
      { name: "JavaScript Essentials", quizCount: 4, correctAnswers: 3 },
      { name: "React Basics", quizCount: 5, correctAnswers: 4 },
    ],
  },
];
