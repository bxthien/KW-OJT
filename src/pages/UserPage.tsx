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
} from "antd";
import type { TabsProps } from "antd";
import { getUsersData } from "../supabase/dataService";
// import { courses } from "../shared/constant/course";
import { supabase } from "../supabase/supabaseClient";

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

  const [form] = Form.useForm();

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
        return [];
      }

      const filteredData = coursesData.map((course) => {
        return {
          ...course,
          courses: {
            ...course.courses,
            chapters: course.courses.chapters.map((chapter) => {
              return {
                ...chapter,
                chapter: {
                  ...chapter.chapter,
                  user_quiz_info: chapter?.chapter?.user_quiz_info.filter(
                    (quiz) => quiz.user_id === student_id
                  ),
                },
              };
            }),
          },
        };
      });
      setDataCourse(filteredData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      message.error("An error occurred while fetching the courses.");
      return [];
    }

    setModalCourse(true);
  };

  console.log(dataCourse, "dataCourse");

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (currentTab === "1") {
        // Add or Edit User
        if (selectedUser) {
          // Update existing user
          const { error } = await supabase
            .from("users")
            .update({
              user_name: values.name,
              email: values.email,
            })
            .eq("user_id", selectedUser.key);

          if (error) {
            message.error("Failed to update user. Please try again.");
            console.error("Update error:", error);
            return;
          }

          const updatedData = userData.map((user) =>
            user.key === selectedUser.key
              ? { ...user, name: values.name, email: values.email }
              : user
          );
          setUserData(updatedData);
          message.success("User updated successfully.");
        } else {
          // Add new user
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                user_name: values.name,
                email: values.email,
                is_admin: true, // Users tab에서는 관리자 설정
              },
            ])
            .select()
            .single();

          if (error || !data) {
            message.error("Failed to add user. Please try again.");
            console.error("Insert error:", error);
            return;
          }

          const newUser = {
            key: data.user_id,
            index: userData.length + 1,
            name: data.user_name,
            type: "Admin",
            date: new Date().toISOString(),
            email: data.email,
            is_admin: true,
          };

          setUserData((prevData) => [...prevData, newUser]);
          message.success("User added successfully.");
        }
      } else if (currentTab === "2") {
        // Add or Edit Student
        if (selectedStudent) {
          // Update existing student
          const { error } = await supabase
            .from("users")
            .update({
              user_name: values.name,
              email: values.email,
            })
            .eq("user_id", selectedStudent.key);

          if (error) {
            message.error("Failed to update student. Please try again.");
            console.error("Update error:", error);
            return;
          }

          const updatedData = studentData.map((student) =>
            student.key === selectedStudent.key
              ? { ...student, name: values.name, email: values.email }
              : student
          );
          setStudentData(updatedData);
          message.success("Student updated successfully.");
        } else {
          // Add new student
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                user_name: values.name,
                email: values.email,
                is_admin: false, // Students tab에서는 관리자가 아님
              },
            ])
            .select()
            .single();

          if (error || !data) {
            message.error("Failed to add student. Please try again.");
            console.error("Insert error:", error);
            return;
          }

          const newStudent = {
            key: data.user_id,
            index: studentData.length + 1,
            name: data.user_name,
            type: "Student",
            date: new Date().toISOString(),
            email: data.email,
          };

          setStudentData((prevData) => [...prevData, newStudent]);
          message.success("Student added successfully.");
        }
      }

      setIsDrawerOpen(false); // Close the drawer
      form.resetFields(); // Reset the form
    } catch (error) {
      console.error("Validation error:", error);
      message.error(
        "Validation failed. Please check the fields and try again."
      );
    }
  };

  useEffect(() => {
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
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: User) => (
        <Switch
          checked={status} // Reflects the current status
          onClick={(checked, event) => {
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
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Birth", dataIndex: "birth", key: "birth" },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (_: string, record: Student) => (
        <a onClick={() => handleModalCourse(record.key)}>Course</a>
      ),
    },
  ];

  const coursesColumns = [
    {
      title: "Course ID",
      dataIndex: ["courses", "course_id"],
      key: "course_id",
    },
    {
      title: "Course Name",
      dataIndex: ["courses", "course_name"],
      key: "course_name",
    },
    {
      title: "Chapters",
      dataIndex: ["courses", "chapters"],
      key: "chapters",
      render: (chapters) => (
        <ul>
          {chapters.map((chapter) => (
            <li key={chapter.chapter_id}>
              {chapter.chapter.chapter_name && (
                <>
                  {chapter.chapter.chapter_name} - Quizzes:{" "}
                  {chapter.chapter.user_quiz_info?.[0]?.correct_answer_cnt || 0}{" "}
                  / {chapter.chapter.quiz_cnt || 0}
                </>
              )}
            </li>
          ))}
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
            <h1 className="text-2xl font-bold">Users</h1>
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
            <h1 className="text-2xl font-bold">Students</h1>
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser(null); // 기존 선택된 User 해제
                setSelectedStudent(null); // 기존 선택된 Student 해제
                form.resetFields(); // 폼 초기화
                setIsDrawerOpen(true); // Drawer 열기
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
            className="flex justify-center mt-4" // 중앙 정렬
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
        width={1300}
        title="Course Modal"
        open={modalCourse}
        onCancel={() => setModalCourse(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalCourse(false)}>
            Cancel
          </Button>,
          // <Button key="submit" type="primary" onClick={() => setModalCourse(false)}>
          //   Submit
          // </Button>,
        ]}
      >
        <Table
          columns={coursesColumns}
          dataSource={dataCourse}
          // rowKey={(record) => record.courses.course_id}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
