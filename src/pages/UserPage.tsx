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
import ChatBot from "./ChatBot";
import { getUsersData } from "../supabase/dataService";
// import { courses } from "../shared/constant/course";
import { supabase } from "../supabase/supabaseClient";

interface User {
  key: string;
  index: number;
  name: string;
  type: string; // "Admin" �Ǵ� "User"
  date: string;
  email: string;
  is_admin: boolean; // ������ ����
  contact?: string; // ����ó (�ɼ�)
  birth?: string; // ������� (�ɼ�)
  age?: number; // ���� (�ɼ�)
}

interface Student {
  key: string;
  index: number;
  name: string;
  type: string; // �׻� "User"
  email: string;
  contact?: string; // ����ó (�ɼ�)
  birth?: string; // ������� (�ɼ�)
  age?: number; // ���� (�ɼ�)
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]); // User �迭
  const [studentData, setStudentData] = useState<Student[]>([]); // Student �迭
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // ���õ� User
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // ���õ� Student
  const [currentTab, setCurrentTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (currentTab === "1") {
        if (selectedUser) {
          // Update Existing User
          const { error } = await supabase
            .from("users")
            .update({ user_name: values.name })
            .eq("user_id", selectedUser.key);

          if (error) {
            message.error("Failed to update user.");
            console.error("Update error:", error);
            return;
          }

          const updatedData = userData.map((user) =>
            user.key === selectedUser.key
              ? { ...user, name: values.name }
              : user
          );
          setUserData(updatedData);
          message.success("User updated successfully.");
        } else {
          // Add New User
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                user_name: values.name,
                email: values.email,
                is_admin: true, // Default to Admin
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
            is_admin: true,
          };

          setUserData([...userData, newUser]);
          message.success("User added successfully.");
        }
      } else if (currentTab === "2" && selectedStudent) {
        // Update Existing Student
        const { error } = await supabase
          .from("users")
          .update({ user_name: values.name })
          .eq("user_id", selectedStudent.key);

        if (error) {
          message.error("Failed to update student.");
          console.error("Update error:", error);
          return;
        }

        const updatedData = studentData.map((student) =>
          student.key === selectedStudent.key
            ? { ...student, name: values.name }
            : student
        );
        setStudentData(updatedData);
        message.success("Student updated successfully.");
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

        // Admin ����ڸ� ���͸��Ͽ� Users �����ͷ� ����
        const formattedUsers = users
          .filter((user) => user.is_admin) // is_admin�� true�� ���
          .map((user, index) => ({
            key: user.user_id,
            index: index + 1,
            name: user.user_name,
            type: "Admin", // Admin���� ����
            date: user.created_at,
            email: user.email,
            is_admin: user.is_admin,
            contact: user.contact,
            status: user.status,
            birth: user.birth,
            age: user.age,
          }));
        setUserData(formattedUsers);

        // Admin�� �ƴ� ����ڸ� Students �����ͷ� ����
        const formattedStudents = users
          .filter((user) => !user.is_admin) // is_admin�� false�� ���
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
      // �����ͺ��̽� ������Ʈ
      const { error } = await supabase
        .from("users")
        .update({ status: checked }) // status�� true/false�� ������Ʈ
        .eq("user_id", record.key); // record.key�� user ID�� �ش�

      if (error) {
        message.error("Failed to update status.");
        console.error("Update error:", error);
        return;
      }

      // ���� ���� ������Ʈ
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
          onClick={(checked, event) => {
            event.stopPropagation(); // Prevents row click
          }}
          onChange={(checked) => handleStatusChange(checked, record)} // ���� ���� ó��
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
  ];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleRowClick = (record: User | Student, isStudent: boolean) => {
    if (isStudent) {
      setSelectedStudent(record as Student); // Student Ÿ������ ó��
      setSelectedUser(null); // Users ���� �ʱ�ȭ
      form.setFieldsValue(record);
    } else {
      setSelectedUser(record as User); // User Ÿ������ ó��
      setSelectedStudent(null); // Students ���� �ʱ�ȭ
      form.setFieldsValue(record);
    }
    setIsDrawerOpen(true); // Drawer ����
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Users",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold"></h1>
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser(null); // Users ���� �ʱ�ȭ
                setSelectedStudent(null); // Students ���� �ʱ�ȭ
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
            className="flex justify-center mt-4" // 중앙 정렬
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
        title={
          selectedUser
            ? "Edit User"
            : selectedStudent
            ? "Edit Student"
            : "Add User"
        }
        placement="right"
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null); // Users ���� �ʱ�ȭ
          setSelectedStudent(null); // Students ���� �ʱ�ȭ
          form.resetFields(); // �� �ʱ�ȭ
        }}
        open={isDrawerOpen}
        width={500}
      >
        <Form form={form} layout="vertical">
          {/* �̸� �ʵ� - ���� ���� */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          {/* �̸��� - �б� ���� */}
          {selectedUser || selectedStudent ? (
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Email</label>
              <p className="text-gray-500">
                {selectedUser?.email || selectedStudent?.email || "Unknown"}
              </p>
            </div>
          ) : (
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter the email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          )}

          {/* ������� - �б� ���� */}
          {(selectedUser || selectedStudent) && (
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Date of Birth
              </label>
              <p className="text-gray-500">
                {selectedUser?.birth || selectedStudent?.birth || "Unknown"}
              </p>
            </div>
          )}

          {/* ���� - �б� ���� */}
          {(selectedUser || selectedStudent) && (
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Age</label>
              <p className="text-gray-500">
                {selectedUser?.age?.toString() ||
                  selectedStudent?.age?.toString() ||
                  "Unknown"}
              </p>
            </div>
          )}
        </Form>

        {/* �ϴ� ��ư */}
        <div className="flex justify-end mt-4">
          <Button type="default" onClick={() => setIsDrawerOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} className="ml-2">
            {selectedUser || selectedStudent ? "Save" : "Add"}
          </Button>
        </div>
      </Drawer>

      <div className="absolute bottom-5 right-5">
        <ChatBot />
      </div>
    </div>
  );
};

export default UserPage;
