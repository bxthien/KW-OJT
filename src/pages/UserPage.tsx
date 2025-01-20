/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Pagination,
  Switch,
  Modal,
  Select,
  notification,
} from "antd";
import type { TabsProps } from "antd";
import { getUsersData } from "../supabase/dataService";
// import { courses } from "../shared/constant/course";
import { supabase } from "../supabase/supabaseClient";
import { registerUser } from "../supabase/authService";

interface User {
  key: string;
  index: number;
  name: string;
  type: string;
  date: string;
  email: string;
  is_admin: boolean;
  contact?: string;
  birth?: string;
  age?: number;
}

interface Student {
  key: string;
  index: number;
  name: string;
  type: string;
  email: string;
  contact?: string;
  birth?: string;
  age?: number;
}

interface QuizInfo {
  user_id: string;
  correct_answer_cnt: number;
}

interface Chapter {
  chapter_id: string;
  chapter_name: string;
  quiz_cnt: number;
  user_quiz_info: QuizInfo[];
}

interface Chapter_Detail {
  chapter_id: string;
  chapter: Chapter;
}

interface Course {
  course_id: string;
  course_name: string;
  chapters: Chapter_Detail[];
}

interface UserCourseInfo {
  courses: Course;
}

interface CourseList {
  course_id: string;
  course_name: string;
  course_chapter: { chapter_id: string }[];
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentTab, setCurrentTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalCourse, setModalCourse] = useState(false);
  const [dataCourse, setDataCourse] = useState<any[]>([]);
  const [modalAddCourse, setModalAddCourse] = useState(false);
  const [courses, setCourses] = useState<CourseList[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<
    { course_id: string }[]
  >([]);

  const [form] = Form.useForm();

  const handleAddUserCourse = async () => {
    if (selectedCourses.length === 0) {
      message.error("Please select at least one course.");
      return;
    }

    try {
      const userCourseInfo = selectedCourses.map(({ course_id }) => ({
        user_id: selectedStudent?.key,
        course_id,
        status_of_learning: "In Progress",
        student_enrollment_date: new Date().toISOString(),
      }));

      const userCourseQuizInfo = selectedCourses.flatMap(({ course_id }) => {
        const course = courses.find((c) => c.course_id === course_id);
        return (
          course?.course_chapter.map((chapter) => ({
            user_id: selectedStudent?.key,
            chapter_id: chapter.chapter_id,
            course_id,
            correct_answer_cnt: 0,
          })) || []
        );
      });

      const { error: quizError } = await supabase
        .from("user_course_quiz_info")
        .insert(userCourseQuizInfo);

      if (quizError) {
        message.error("Failed to add course quiz info. Please try again.");
        console.error("Insert error:", quizError);
        return;
      }

      const { error } = await supabase
        .from("user_course_info")
        .insert(userCourseInfo);

      if (error) {
        message.error("Failed to add courses. Please try again.");
        console.error("Insert error:", error);
        return;
      }

      notification.success({ message: "Courses added successfully." });
      setModalAddCourse(false);
      setSelectedCourses([]);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error adding courses:", err);
      message.error("An error occurred while adding the courses.");
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `course_id, course_name,  
          course_chapter (
          chapter_id
        )`
        )
        .order("date_of_update", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error.message);
        return;
      }
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleModalCourse = async (student_id: string) => {
    try {
      const { data: coursesData, error } = await supabase
        .from("user_course_info")
        .select(
          `
          courses:course_id (
            course_id,
            course_name,
            chapters:course_chapter!inner (
              chapter_id,
              chapter:chapter_id (
                chapter_id,
                chapter_name,
                quiz_cnt,
                user_quiz_info:user_course_quiz_info!inner (
                  user_id,
                  correct_answer_cnt
                )
              )
            )
          )
        `
        )
        .eq("user_id", student_id);

      if (error) {
        message.error("Failed to fetch courses. Please try again.");
        console.error("Fetch error:", error);
        return;
      }

      if (!coursesData) {
        setDataCourse([]);
        return;
      }

      // ������ ���͸� �� Ÿ�� ����
      const filteredData: UserCourseInfo[] = coursesData.map((course: any) => ({
        ...course,
        courses: {
          ...course.courses,
          chapters: course.courses.chapters?.map((chapter: any) => ({
            ...chapter,
            chapter: {
              ...chapter.chapter,
              user_quiz_info: chapter.chapter?.user_quiz_info.filter(
                (quiz: QuizInfo) => quiz.user_id === student_id
              ),
            },
          })),
        },
      }));

      setDataCourse(filteredData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      message.error("An error occurred while fetching the courses.");
    }

    setModalCourse(true);
  };

  console.log(dataCourse, "dataCourse");

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Validate form input
      const password = "defaultPassword123"; // Default password for new accounts

      if (currentTab === "1") {
        // Add new admin user
        const { data, error } = await supabase
          .from("users")
          .insert([
            {
              user_name: values.name,
              email: values.email,
              contact: values.contact || null,
              status: values.status !== undefined ? values.status : true,
              is_admin: true,
            },
          ])
          .select()
          .single();

        if (error || !data) {
          message.error(
            "Failed to add user to the database. Please try again."
          );
          console.error("Insert error:", error);
          return;
        }

        // Register user in authentication
        try {
          await registerUser(values.email, password, { username: values.name });
        } catch (authError) {
          console.error("Authentication error (Admin):", authError);
        }

        const newUser = {
          key: data.user_id,
          index: userData.length + 1,
          name: data.user_name,
          type: "Admin",
          date: new Date().toISOString(),
          email: data.email,
          contact: data.contact,
          status: data.status,
          is_admin: true,
        };

        setUserData((prevData) => [...prevData, newUser]);
        message.success("User added successfully.");
      } else if (currentTab === "2") {
        // Add new student
        const { data, error } = await supabase
          .from("users")
          .insert([
            {
              user_name: values.name,
              email: values.email,
              contact: values.contact || null,
              date_of_birth: values.date_of_birth || null,
              age: values.age,
              is_admin: false,
            },
          ])
          .select()
          .single();

        if (error || !data) {
          message.error(
            "Failed to add student to the database. Please try again."
          );
          console.error("Insert error:", error);
          return;
        }

        // Register student in authentication
        try {
          await registerUser(values.email, password, { username: values.name });
        } catch (authError) {
          console.error("Authentication error (Student):", authError);
        }

        const newStudent = {
          key: data.user_id,
          index: studentData.length + 1,
          name: data.user_name,
          type: "Student",
          date: new Date().toISOString(),
          email: data.email,
          contact: data.contact,
          age: values.age,
          date_of_birth: data.date_of_birth,
        };

        setStudentData((prevData) => [...prevData, newStudent]);
        message.success("Student added successfully.");
      }

      setIsDrawerOpen(false); // Close the drawer
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Validation error:", error);
      message.error(
        "Validation failed. Please check the fields and try again."
      );
    }
    fetchData(); // Refresh data after adding user/student
  };

  const fetchData = async () => {
    try {
      const users = await getUsersData();

      const formattedUsers = users
        .filter((user) => user.is_admin)
        .map((user, index) => ({
          key: user.user_id,
          index: index + 1,
          name: user.user_name,
          type: "Admin",
          date: user.created_at,
          email: user.email,
          is_admin: user.is_admin,
          contact: user.contact,
          status: user.status,
          birth: user.birth,
          age: user.age,
        }));
      setUserData(formattedUsers);

      const formattedStudents = users
        .filter((user) => !user.is_admin)
        .map((user, index) => ({
          key: user.user_id,
          index: index + 1,
          name: user.user_name,
          type: "User",
          date: user.created_at,
          email: user.email,
          contact: user.contact,
          birth: user.birth,
          age: user.age,
        }));
      setStudentData(formattedStudents);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (checked: boolean, record: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: checked })
        .eq("user_id", record.key);

      if (error) {
        message.error("Failed to update status.");
        console.error("Update error:", error);
        return;
      }

      const updatedData = userData.map((user) =>
        user.key === record.key ? { ...user, status: checked } : user
      );
      setUserData(updatedData);

      message.success("Status updated successfully.");
    } catch (err) {
      console.error("Error updating status:", err);
      message.error("An error occurred while updating the status.");
    }
  };

  const userColumns = [
    { title: "No.", dataIndex: "index", key: "index" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact: string | undefined) =>
        contact && contact.toLowerCase() !== "unknown" ? contact : "N/A", // Unknown 처리
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: User) => (
        <Switch
          checked={status} // Reflects the current status
          onClick={(_, event) => {
            event.stopPropagation(); // Prevents row click
          }}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
  ];

  const studentColumns = [
    { title: "No.", dataIndex: "index", key: "index" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Student) => (
        <a onClick={() => handleRowClick(record, false)}>{record.name}</a>
      ),
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact: string | undefined) =>
        contact && contact.toLowerCase() !== "unknown" ? contact : "N/A", // Unknown 처리
    },
    {
      title: "Birth",
      dataIndex: "birth",
      key: "birth",
      render: (birth: string | undefined) =>
        birth && birth.toLowerCase() !== "unknown" ? birth : "N/A", // Unknown 처리
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age: number) => <>{age ? age : "N/A"}</>,
    },
    {
      title: "Action",
      dataIndex: "courses",
      key: "courses",
      render: (_: string, record: Student) => (
        <div className="flex flex-row gap-1">
          <img
            src="https://img.icons8.com/?size=100&id=85927&format=png&color=000000"
            alt="Courses Icon"
            className="w-5 h-5"
            onClick={() => handleModalCourse(record.key)}
          />

          <img
            src="https://img.icons8.com/?size=100&id=102397&format=png&color=000000"
            alt="Edit Icon"
            className="w-5 h-5"
            onClick={() => {
              setModalAddCourse(true);
              fetchCourses();
              setSelectedStudent(record);
            }}
          />
        </div>
      ),
    },
  ];

  const coursesColumns = [
    {
      title: "Course Name",
      dataIndex: ["courses", "course_name"],
      key: "course_name",
    },
    {
      title: "Chapters",
      dataIndex: ["courses", "chapters"],
      key: "chapters",
      render: (chapters: Chapter_Detail[]) => (
        <ul>
          {chapters && chapters.length > 0 ? (
            chapters.map(
              (chapter: Chapter_Detail) =>
                chapter.chapter.user_quiz_info && (
                  <li key={chapter.chapter_id}>
                    {chapter.chapter.chapter_name}
                  </li>
                )
            )
          ) : (
            <li>No chapters available</li>
          )}
        </ul>
      ),
    },
    {
      title: "Quizzes",
      dataIndex: ["courses", "chapters"],
      key: "chapters",
      render: (chapters: Chapter_Detail[]) => (
        <ul>
          {chapters && chapters.length > 0 ? (
            chapters.map(
              (chapter: Chapter_Detail) =>
                chapter.chapter.user_quiz_info && (
                  <li key={chapter.chapter_id}>
                    {chapter?.chapter.user_quiz_info?.[0]?.correct_answer_cnt ||
                      0}{" "}
                    / {chapter?.chapter.quiz_cnt || 0}
                  </li>
                )
            )
          ) : (
            <li>No chapters available</li>
          )}
        </ul>
      ),
    },
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleRowClick = (record: User | Student, isStudent: boolean) => {
    if (isStudent) {
      setSelectedStudent(record as Student);
      setSelectedUser(null);
      form.setFieldsValue(record);
    } else {
      setSelectedUser(record as User);
      setSelectedStudent(null);
      form.setFieldsValue(record);
    }
    setIsDrawerOpen(true);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Users",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold"> </h1>
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser(null);
                setSelectedStudent(null);
                form.resetFields();
                setIsDrawerOpen(true);
              }}
            >
              Add User
            </Button>
          </div>

          <Table
            columns={userColumns}
            dataSource={userData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            pagination={false}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record, false),
            // })}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={userData.length}
            onChange={handlePaginationChange}
            className="flex justify-center mt-4"
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Students",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold"></h1>
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser(null); // 기존  �� �� �� User  �� ��
                setSelectedStudent(null); // 기존  �� �� �� Student  �� ��
                form.resetFields(); //  �� 초기 ��
                setIsDrawerOpen(true); // Drawer  ���
              }}
            >
              Add Student
            </Button>
          </div>
          <Table
            columns={studentColumns}
            dataSource={studentData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            pagination={false}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record, true),
            // })}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={studentData.length}
            onChange={handlePaginationChange}
            className="flex justify-center mt-4" // 중앙  �� ��
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <div className="scroll-container flex-grow bg-gray-50 p-5">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(key) => {
            setCurrentTab(key);
            setCurrentPage(1);
          }}
        />
      </div>

      <Drawer
        title={
          selectedUser
            ? "Edit User"
            : selectedStudent
            ? "Edit Student"
            : currentTab === "1"
            ? "Add User"
            : "Add Student"
        }
        placement="right"
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
          setSelectedStudent(null);
          form.resetFields();
        }}
        open={isDrawerOpen}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item label="Contact" name="contact">
            <Input placeholder="Enter contact (optional)" />
          </Form.Item>

          {currentTab === "1" && ( // Users  �� �� ���  Status  �� ��
            <Form.Item
              label="Status"
              name="status"
              valuePropName="checked"
              initialValue={true} // 기본�   �� ��
            >
              <Switch />
            </Form.Item>
          )}

          {currentTab === "2" && (
            <>
              <Form.Item label="Date of Birth" name="date_of_birth">
                <Input placeholder="Enter date of birth (optional)" />
              </Form.Item>
              <Form.Item label="age" name="age">
                <Input placeholder="age(optional)" />
              </Form.Item>
            </>
          )}
        </Form>

        <div className="flex justify-end mt-4">
          <Button type="default" onClick={() => setIsDrawerOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} className="ml-2">
            {selectedUser || selectedStudent ? "Save" : "Add"}
          </Button>
        </div>
      </Drawer>

      {/* <div className="absolute bottom-5 right-5">
        <ChatBot />
      </div> */}

      <Modal
        width={900}
        title="Course Modal"
        open={modalCourse}
        onCancel={() => setModalCourse(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalCourse(false)}>
            Cancel
          </Button>,
        ]}
      >
        <Table
          columns={coursesColumns}
          dataSource={dataCourse}
          // rowKey={(record) => record.courses.course_id}
          pagination={false}
        />
      </Modal>

      <Modal
        width={500}
        title="Add Course"
        open={modalAddCourse}
        onOk={handleAddUserCourse}
        onCancel={() => {
          setModalAddCourse(false);
          setSelectedCourses([]);
          setSelectedStudent(null);
        }}
      >
        <Select
          mode="multiple"
          placeholder="Select chapters to add"
          style={{ width: "100%", marginBottom: "16px" }}
          options={courses.map((course) => ({
            label: course.course_name,
            value: course.course_id,
          }))}
          onChange={(selectedCourseIds) =>
            setSelectedCourses(
              selectedCourseIds.map((id) => ({ course_id: id }))
            )
          }
          value={selectedCourses.map((course) => course.course_id)}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
