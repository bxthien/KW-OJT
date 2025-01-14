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
} from "antd";
import type { TabsProps } from "antd";
import { getUsersData } from "../supabase/dataService";
import { supabase } from "../supabase/supabaseClient";

interface User {
  key: string;
  index: number;
  name: string;
  type: string; // "Admin" 또는 "User"
  date: string;
  email: string;
  is_admin: boolean; // 관리자 여부
  contact?: string; // 연락처 (옵션)
  birth?: string; // 생년월일 (옵션)
  age?: number; // 나이 (옵션)
}

interface Student {
  key: string;
  index: number;
  name: string;
  type: string; // 항상 "User"
  status: string; // 예: "Active"
  joined: string;
  course: string;
  contact?: string; // 연락처 (옵션)
  birth?: string; // 생년월일 (옵션)
  age?: number; // 나이 (옵션)
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]); // User 배열
  const [studentData, setStudentData] = useState<Student[]>([]); // Student 배열
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 선택된 User
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // 선택된 Student
  // const [selectedCourse, setSelectedCourse] = useState();
  const [currentTab, setCurrentTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  console.log(selectedStudent);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (currentTab === "1") {
        if (selectedUser) {
          // Update Existing User
          const { error } = await supabase
            .from("users")
            .update({ user_name: values.name, email: values.email })
            .eq("user_name", selectedUser.key); // Match the correct ID for updating

          if (error) {
            message.error("Failed to update user.");
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
          // Add New User with is_admin: true
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                user_name: values.name,
                email: values.email,
                is_admin: true, // Always set is_admin to true
              },
            ])
            .select()
            .single();

          if (error || !data) {
            message.error("Failed to add user.");
            console.error("Insert error:", error);
            return;
          }

          const newUser = {
            key: data.id,
            index: userData.length + 1,
            name: data.user_name,
            type: "Admin", // Set type as Admin
            date: new Date().toISOString(),
            email: data.email,
            is_admin: true, // is_admin 필수 속성 추가
          };

          setUserData([...userData, newUser]);
          message.success("User added successfully.");
        }
      }

      setIsDrawerOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Validation failed.");
      console.error("Validation error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsersData();

        // Admin 사용자만 필터링하여 Users 데이터로 설정
        const formattedUsers = users
          .filter((user) => user.is_admin) // is_admin이 true인 경우
          .map((user, index) => ({
            key: user.user_id,
            index: index + 1,
            name: user.user_name,
            type: "Admin", // Admin으로 설정
            date: user.created_at,
            email: user.email,
            is_admin: user.is_admin,
            contact: user.contact,
            status: user.status,
            birth: user.birth,
            age: user.age,
          }));
        setUserData(formattedUsers);

        // Admin이 아닌 사용자만 Students 데이터로 설정
        const formattedStudents = users
          .filter((user) => !user.is_admin) // is_admin이 false인 경우
          .map((user, index) => ({
            key: user.user_id,
            index: index + 1,
            name: user.user_name,
            type: "User",
            date: user.created_at,
            email: user.email,
            status: "Active", // 예시로 Active 상태 추가
            joined: user.created_at,
            course: "No course assigned",
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
      // 데이터베이스 업데이트
      const { error } = await supabase
        .from("users")
        .update({ status: checked }) // status를 true/false로 업데이트
        .eq("user_id", record.key); // record.key가 user ID에 해당

      if (error) {
        message.error("Failed to update status.");
        console.error("Update error:", error);
        return;
      }

      // 로컬 상태 업데이트
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
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
          onChange={(checked) => handleStatusChange(checked, record)} // 상태 변경 처리
        />
      ),
    },
  ];

  const studentColumns = [
    { title: "No.", dataIndex: "index", key: "index" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Birth", dataIndex: "birth", key: "birth" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // const handleStudentCourseClick = (courseName: string) => {
  //   const selected = courses.find((course) => course.title === courseName);
  //   if (selected) {
  //     setSelectedCourse(selected);
  //     setIsChapterDrawerOpen(true);
  //   } else {
  //     message.error("Course details not found.");
  //   }
  // };

  const handleRowClick = (record: User | Student, isStudent: boolean) => {
    if (isStudent) {
      setSelectedStudent(record as Student); // Student 타입으로 처리
      form.setFieldsValue(record);
    } else {
      setSelectedUser(record as User); // User 타입으로 처리
      form.setFieldsValue(record);
    }
    setIsDrawerOpen(true); // Drawer 열기
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record, false),
            })}
          />
          <Pagination
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
          <Table
            columns={studentColumns}
            dataSource={studentData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record, true),
            })}
          />
          <Pagination
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
        title={selectedUser ? "Edit User" : "Add User"}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={500}
      >
        <Form form={form} layout="vertical">
          {/* 이름 필드 - 수정 가능 */}
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
                <Input disabled placeholder="Enter contact" />
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

        {/* 하단 버튼 */}
        <div className="flex justify-end mt-4">
          <Button type="default" onClick={() => setIsDrawerOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} className="ml-2">
            Save
          </Button>
        </div>
      </Drawer>

      {/* <div className="absolute bottom-5 right-5">
        <ChatBot />
      </div> */}
    </div>
  );
};

export default UserPage;
