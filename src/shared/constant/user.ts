export interface User {
  key: string;
  name: string;
  type: string;
  date: string;
  contact: string;
}

export interface Student {
  key: string;
  name: string;
  type: string;
  status: string;
  joined: string;
  course: string;
}

export const userData: User[] = [
  {
    key: "1",
    name: "Dianne Russell",
    type: "User",
    date: "25 Jan 2022",
    contact: "abcd@gmail.com",
  },
];

export const studentData: Student[] = [
  {
    key: "1",
    name: "Ro",
    type: "Student",
    status: "In progress",
    joined: "15 May 2020 8:00 am",
    course: "KNU",
  },
];
