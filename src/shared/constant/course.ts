export interface Course {
  color: string;
  description: string;
  tag: string;
  title: string;
  id: string;
  chapters: number;
  orders: number;
  certificates: number;
  reviews: number;
  addedToShelf: number;
}
export const courses: Course[] = [
  {
    tag: "FOR KNU",
    title: "GLOBAL INTERNSHIP - KNU",
    id: "#21453",
    chapters: 13,
    orders: 16,
    certificates: 10,
    reviews: 0,
    addedToShelf: 16,
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
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
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
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
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
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
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
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
    description: "A detailed guide to global internships at KNU.",
    color: "blue",
  },
];
