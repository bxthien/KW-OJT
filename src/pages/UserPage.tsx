import React from "react";
import { Tabs, Table } from "antd";
import type { TabsProps } from "antd";
import ChatBot from "./ChatBot";

const UserPage: React.FC = () => {
  const userColumns = [
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

  const userData = [
    {
      key: "1",
      name: "Dianne Russell",
      type: "User",
      date: "25 Jan 2022",
      contact: "abcd@gmail.com",
    },
  ];

  const studentColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
    },
    {
      title: "Quiz",
      dataIndex: "quiz",
      key: "quiz",
    },
  ];

  const studentData = [
    {
      key: "1",
      id: "HTML",
      name: "Ro",
      type: "Student",
      status: "In progress",
      joined: "15 May 2020 8:00 am",
      course: "KNU",
      quiz: "Score",
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Users",
      children: (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex gap-4 mb-5">
            <div className="flex-1 bg-white border border-gray-300 rounded p-5 text-center shadow">
              <h2 className="text-lg text-blue-500 mb-2">$1K</h2>
              <p className="text-sm text-gray-500">
                Life Time Courses Commission
              </p>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded p-5 text-center shadow">
              <h2 className="text-lg text-blue-500 mb-2">$800.00</h2>
              <p className="text-sm text-gray-500">
                Life Time Received Commission
              </p>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded p-5 text-center shadow">
              <h2 className="text-lg text-blue-500 mb-2">$200.00</h2>
              <p className="text-sm text-gray-500">
                Life Time Pending Commission
              </p>
            </div>
          </div>
          <Table
            columns={userColumns}
            dataSource={userData}
            pagination={false}
            className="antd-table"
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
            dataSource={studentData}
            pagination={false}
            className="antd-table"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen font-sans bg-gray-100 relative">
      <div className="flex-grow bg-gray-50 p-5">
        <h1 className="text-2xl font-bold mb-5 text-black">Users</h1>
        <Tabs defaultActiveKey="1" items={items} />
      </div>

      {/* ChatBot Component */}
      <div className="absolute bottom-5 right-5">
        <ChatBot />
      </div>
    </div>
  );
};

export default UserPage;
