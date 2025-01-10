import React, { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Pagination,
} from "antd";
import type { TabsProps } from "antd";
import {
  userData as initialUserData,
  studentData as initialStudentData,
} from "../shared/constant/user";

import { courses } from "../shared/constant/course";

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState(
    initialUserData.map((item, index) => ({
      ...item,
      index: index + 1, // 번호 추가
    }))
  );
  const [studentData, setStudentData] = useState(
    initialStudentData.map((item, index) => ({
      ...item,
      index: index + 1, // 번호 추가
    }))
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 한 페이지에 표시할 데이터 수
  const [form] = Form.useForm();

  const userColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
  ];

  const studentColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (text: string) => {
        const courseExists = courses.some((course) => course.title === text);
        return courseExists ? (
          <Button type="link" onClick={() => handleStudentCourseClick(text)}>
            {text}
          </Button>
        ) : (
          <span>{text}</span> // 존재하지 않는 경우 클릭 불가
        );
      },
    },
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleStudentCourseClick = (courseName: string) => {
    const selected = courses.find((course) => course.title === courseName);
    if (selected) {
      setSelectedCourse(selected);
      setIsChapterDrawerOpen(true);
    } else {
      message.error("Course details not found.");
    }
  };

  const handleRowClick = (record: any, isStudent: boolean) => {
    if (isStudent) {
      setSelectedStudent(record);
      form.setFieldsValue(record);
    } else {
      setSelectedUser(record);
      form.setFieldsValue(record);
    }
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (currentTab === "1") {
          if (selectedUser) {
            // Update existing user
            const updatedData = userData.map((user) =>
              user.key === selectedUser.key ? { ...user, ...values } : user
            );
            setUserData(updatedData);
            message.success("User updated successfully.");
          } else {
            // Add new user
            const newKey = (userData.length + 1).toString();
            const newUser = {
              key: newKey,
              ...values,
              index: userData.length + 1,
            };
            setUserData([...userData, newUser]);
            message.success("User added successfully.");
          }
        } else {
          if (selectedStudent) {
            // Update existing student
            const updatedData = studentData.map((student) =>
              student.key === selectedStudent.key
                ? { ...student, ...values }
                : student
            );
            setStudentData(updatedData);
            message.success("Student updated successfully.");
          } else {
            // Add new student
            const newKey = (studentData.length + 1).toString();
            const newStudent = {
              key: newKey,
              ...values,
              index: studentData.length + 1,
            };
            setStudentData([...studentData, newStudent]);
            message.success("Student added successfully.");
          }
        }
        setIsDrawerOpen(false);
        form.resetFields(); // Clear form fields
      })
      .catch((error) => {
        message.error("Failed to save changes.");
        console.error(error);
      });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Users",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser(null);
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
            className="antd-table"
            rowClassName="hover-row"
            onRow={(record) => ({
              onClick: () => handleRowClick(record, false),
            })}
          />
          <Pagination
            align="center"
            className="mt-4"
            current={currentPage}
            pageSize={pageSize}
            total={userData.length}
            onChange={handlePaginationChange}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Students",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              onClick={() => {
                setSelectedStudent(null);
                form.resetFields();
                setIsDrawerOpen(true);
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
            className="antd-table"
            rowClassName="hover-row"
            onRow={(record) => ({
              onClick: () => handleRowClick(record, true),
            })}
          />
          <Pagination
            align="center"
            className="mt-4"
            current={currentPage}
            pageSize={pageSize}
            total={studentData.length}
            onChange={handlePaginationChange}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen font-sans bg-gray-100 overflow-auto">
      <div className="scroll-container flex-grow bg-gray-50 p-5">
        <h1 className="text-2xl font-bold mb-5 text-black">Users</h1>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(key) => {
            setCurrentTab(key);
            setCurrentPage(1); // 탭 변경 시 첫 페이지로 리셋
          }}
        />
      </div>
      <Drawer
        title={
          currentTab === "1"
            ? selectedUser
              ? "Edit User"
              : "Add User"
            : selectedStudent
            ? "Edit Student"
            : "Add Student"
        }
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
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
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please enter the type" }]}
          >
            <Input placeholder="Enter type" />
          </Form.Item>
          {currentTab === "1" && (
            <>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please enter the date" }]}
              >
                <Input placeholder="Enter date" />
              </Form.Item>
              <Form.Item
                label="Contact"
                name="contact"
                rules={[
                  { required: true, message: "Please enter the contact" },
                ]}
              >
                <Input placeholder="Enter contact" />
              </Form.Item>
            </>
          )}
          {currentTab === "2" && (
            <>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please enter the status" }]}
              >
                <Input placeholder="Enter status" />
              </Form.Item>
              <Form.Item
                label="Joined"
                name="joined"
                rules={[
                  { required: true, message: "Please enter the joined date" },
                ]}
              >
                <Input placeholder="Enter joined date" />
              </Form.Item>
              <Form.Item
                label="Course"
                name="course"
                rules={[{ required: true, message: "Please enter the course" }]}
              >
                <Input placeholder="Enter course" />
              </Form.Item>
            </>
          )}
        </Form>
        <div className="flex justify-between mt-4">
          {selectedUser || selectedStudent ? (
            <Button
              type="default"
              danger
              onClick={() => {
                if (currentTab === "1") {
                  const updatedData = userData.filter(
                    (user) => user.key !== selectedUser.key
                  );
                  setUserData(updatedData);
                  message.success("User deleted successfully.");
                } else {
                  const updatedData = studentData.filter(
                    (student) => student.key !== selectedStudent.key
                  );
                  setStudentData(updatedData);
                  message.success("Student deleted successfully.");
                }
                setIsDrawerOpen(false);
              }}
            >
              Delete
            </Button>
          ) : null}
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Drawer>

      <Drawer
        title={`Course: ${selectedCourse?.title}`}
        placement="right"
        onClose={() => {
          setIsChapterDrawerOpen(false); // Course Details Drawer 닫기
          setSelectedStudent(null); // Edit Drawer 관련 상태 초기화
          setSelectedUser(null);
          setIsDrawerOpen(false); // Edit Drawer 강제 닫기
        }}
        open={isChapterDrawerOpen}
        width={500}
      >
        <h2 className="text-lg font-bold mb-4">Course Details</h2>
        <Table
          columns={[
            { title: "Chapter Name", dataIndex: "name", key: "name" },
            {
              title: "Quiz Count",
              dataIndex: "quizCount",
              key: "quizCount",
            },
            {
              title: "Correct Answers",
              dataIndex: "correctAnswers",
              key: "correctAnswers",
            },
          ]}
          dataSource={selectedCourse?.chapterDetails}
          rowKey="name"
          pagination={false}
        />
      </Drawer>

      <div className="absolute bottom-5 right-5">{/* <ChatBot /> */}</div>
    </div>
  );
};

export default UserPage;
