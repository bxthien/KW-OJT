import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Tag,
  Pagination,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"; // DeleteOutlined
import type { SelectProps } from "antd";

interface Chapter {
  key: string;
  id: number;
  name: string;
  quiz: number;
  dateCreated: string;
  lectures: Lecture[];
}

interface Lecture {
  name: string;
}

// Lecture(fake data can erase)
const options: SelectProps["options"] = [
  { value: "Introduction to Git" },
  { value: "Understanding GitHub" },
  { value: "Git Commands" },
  { value: "What is Prompt Engineering?" },
  { value: "Writing Effective Prompts" },
];

const tagRender: SelectProps["tagRender"] = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color="blue"
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

const ChapterPage: React.FC = () => {
  const [chapterData, setChapterData] = useState<Chapter[]>([
    {
      key: "1",
      id: 1,
      name: "Git & Github",
      quiz: 30,
      dateCreated: "15 May 2020 8:00 am",
      lectures: [
        { name: "Introduction to Git" },
        { name: "Understanding GitHub" },
        { name: "Git Commands" },
      ],
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [form] = Form.useForm();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Chapter Name", dataIndex: "name", key: "name" },
    { title: "Quiz", dataIndex: "quiz", key: "quiz" },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Chapter) => (
        <Button
          type="link"
          onClick={() => handleDetailsClick(record)}
          icon={<EditOutlined />}
          style={{ fontSize: "18px" }}
        />
      ),
    },
  ];

  const handleDetailsClick = (record: Chapter) => {
    setIsAdding(false);
    setSelectedChapter(record);
    form.setFieldsValue({
      name: record.name,
      quiz: record.quiz,
      lectures: record.lectures.map((lecture) => lecture.name),
    });
    setIsDrawerOpen(true);
  };

  const handleAddChapter = () => {
    setIsAdding(true);
    setSelectedChapter(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (isAdding) {
          const newChapter: Chapter = {
            key: `${chapterData.length + 1}`,
            id: chapterData.length + 1,
            name: values.name,
            quiz: values.quiz,
            dateCreated: new Date().toLocaleString(),
            lectures: values.lectures.map((lectureName: string) => ({
              name: lectureName,
            })),
          };
          setChapterData([...chapterData, newChapter]);
          message.success("Chapter added successfully!");
        } else if (selectedChapter) {
          const updatedData = chapterData.map((chapter) =>
            chapter.id === selectedChapter.id
              ? {
                  ...chapter,
                  name: values.name,
                  quiz: values.quiz,
                  lectures: values.lectures.map((lectureName: string) => ({
                    name: lectureName,
                  })),
                }
              : chapter
          );
          setChapterData(updatedData);
          message.success("Chapter updated successfully!");
        }
        setIsDrawerOpen(false);
        form.resetFields();
      })
      .catch(() => {
        message.error("Please fill in all fields correctly.");
      });
  };

  const handleDelete = () => {
    if (selectedChapter) {
      const updatedData = chapterData.filter(
        (chapter) => chapter.id !== selectedChapter.id
      );
      setChapterData(updatedData);
      message.success("Chapter deleted successfully!");
      setIsDrawerOpen(false);
    }
  };

  // page change
  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-black font-bold">Chapter Page</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddChapter}
        >
          Add Chapter
        </Button>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table
          columns={columns}
          dataSource={chapterData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={false}
          bordered={false}
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
          rowClassName={() => "custom-row"}
          onRow={() => ({
            style: {
              borderBottom: "1px solid #e8e8e8",
              padding: "12px 0",
            },
          })}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={chapterData.length}
            onChange={handlePaginationChange}
            style={{
              display: "inline-block",
            }}
          />
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        title={isAdding ? "Add Chapter" : `Edit ${selectedChapter?.name}`}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Chapter Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the chapter name" },
            ]}
          >
            <Input placeholder="Enter chapter name" />
          </Form.Item>
          <Form.Item
            label="Quiz"
            name="quiz"
            rules={[{ required: true, message: "Please enter the quiz count" }]}
          >
            <Input type="number" placeholder="Enter quiz count" />
          </Form.Item>
          <Form.Item label="Lectures" name="lectures">
            <Select
              mode="multiple"
              tagRender={tagRender}
              options={options}
              placeholder="Add lectures"
            />
          </Form.Item>
        </Form>

        {/* Delete & Save Buttons */}
        <div className="flex justify-end mt-4 gap-2">
          <Popconfirm
            title="Are you sure to delete this chapter?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ChapterPage;
